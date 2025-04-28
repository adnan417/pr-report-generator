const fs = require('fs')
require('dotenv').config()

const { generateReport } = require('./services/report');
const {generateDocument }= require('./utils/generate-document');


    (async () => {

        //Read repos and their types from command line arguments
        const args = process.argv.slice(2);

        if(args.length==0){
            console.log("Please provide atleast one repo in format type:repoName")
            process.exit(1);
        }

        //Parse the arguments
        const repositories = args.map((arg)=>{
            const [type,repoName] = arg.split(":");
            if (!type || !repoName) {
                console.error(`Invalid argument: ${arg}. Expected format type:repoName`);
                process.exit(1);
            }

            return {
                type,
                repoName
            }
        })

        //Loop over all repositories one by one and save their data
        const data={};

        for(let {type,repoName} of repositories){
            const report = await generateReport(process.env.REPO_OWNER, repoName);
            data[type]=report;
        }

        //Print the output to generate it manually
        for(let d in data){
            const {keyInsights,...rest} = data[d];
            console.log(JSON.stringify({
                type:d,
                ...rest
            }))
        }

        const buffer = await generateDocument(data)

        fs.writeFileSync("Weekly-PR-Report.docx", buffer);
        console.log("Report generated: Weekly-PR-Report.docx");

    })();

    