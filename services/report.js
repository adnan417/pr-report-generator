const Github = require('./github');
const Llm = require("./ai")
const { getWeekRange } = require('../utils/date-functions');

module.exports.generateReport = async (ownerName, repoName) => {

    try {
        const { startDate, endDate } = getWeekRange();

        const github = new Github(ownerName, repoName);

        const prs = await github.fetchPRs(startDate, endDate);

        let openPrCount = 0, closedPrCount = 0, rejectedPrCount = 0, mergedPrCount = 0;
        const prDetails = [];

        prs.forEach(pr => {
            if (pr.state == 'open') {
                openPrCount++;
            } else {
                closedPrCount++;

                //merged, rejected
                if (pr.merged_at) {
                    mergedPrCount++;
                } else {
                    rejectedPrCount++;
                }
            }

            prDetails.push({
                title: pr.title,
                number: pr.number
            })
        })

        // Get key insights using AI
        const llm = new Llm(JSON.stringify(prDetails));
        const keyInsights = await llm.getInsightsByGroq();

        const report = {
            totalPrs: prs.length,
            openPrs: openPrCount,
            closedPrs: closedPrCount,
            mergedPrs: mergedPrCount,
            rejectedPrs: rejectedPrCount,
            keyInsights: keyInsights,
            prDetails:prDetails
        }

        return report;

        // const report = {
        //     week: `${startDate.slice(0,10)} to ${endDate.slice(0,10)}`,
        //     totalReviewedPrs: prs.length,
        //     approved:0,
        //     rejected:0,
        //     approvers: new Set(),
        //     comments:0,
        //     rejections: []
        // }

        // for(const pr of prs){
        //     // const prDetail = await github.getPRDetails(pr.number);
        //     const reviews = await github.getPRReviews(pr.number);
        //     const comments = await github.getPRComments(pr.number);

        //     report.comments += comments.length;
        //     report.merged += (pr.merged_at ? 1 : 0);


        //     const approvals = reviews.filter(r=> r.state === 'APPROVED');
        //     const rejections = reviews.filter(r => r.state === 'CHANGES_REQUESTED');

        //     if(approvals.length>0){
        //         report.approved += 1;

        //         approvals.forEach(r => {
        //             report.approvers.add(r.user.login)
        //         });
        //     }

        //     if(rejections.length>0){
        //         report.rejected += 1;

        //         rejections.forEach(r=>{
        //             report.rejections.push({
        //                 pr:pr.number,
        //                 reviewer: r.user.login,
        //                 reason: r.body || "No reason provided"
        //             })
        //         })
        //     }
        // }

        // report.approvers = Array.from(report.approvers)

        // console.log('\nWeekly PR Review Report:\n');
        // console.log(JSON.stringify(report, null, 2));

        // return report;

    } catch (err) {
        console.log("Error in generating report")
        console.log(err)
    }

}