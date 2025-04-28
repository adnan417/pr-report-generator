const { getWeekRange } = require('../utils/date-functions');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} = require("docx");

// Font constants
const FONT_FAMILY = "Verdana";
const FONT_SIZE_PARAGRAPH = 22; // 11pt
const FONT_SIZE_HEADING = 32; // 16pt
const FONT_SIZE_TITLE = 40; // 20pt

// Helper functions
const createParagraph = (text, spacingAfter = 200, spacingBefore = 0, bold = false, alignment = AlignmentType.LEFT) =>
  new Paragraph({
    children: [
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: FONT_SIZE_PARAGRAPH,
        bold,
      }),
    ],
    alignment,
    spacing: { after: spacingAfter, before: spacingBefore },
  });

const createBullet = (text, level = 0) =>
  new Paragraph({
    children: [
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: FONT_SIZE_PARAGRAPH,
      }),
    ],
    bullet: { level },
    spacing: { after: 100 },
  });

const createHeading = (text, level, bold = true) => {
  const fontSize = level === HeadingLevel.TITLE ? FONT_SIZE_TITLE : FONT_SIZE_HEADING;
  return new Paragraph({
    children: [
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: fontSize,
        bold,
      }),
    ],
    heading: level,
    spacing: { after: 300, before: 300 },
    alignment: AlignmentType.LEFT,
  });
};

const createStat = (label, value) =>
  new Paragraph({
    children: [
      new TextRun({
        text: `${label}: `,
        font: FONT_FAMILY,
        size: FONT_SIZE_PARAGRAPH,
        bold: true,
      }),
      new TextRun({
        text: String(value),
        font: FONT_FAMILY,
        size: FONT_SIZE_PARAGRAPH,
      }),
    ],
    spacing: { after: 150 },
  });

const createSection = (title, sectionData) => {
  const stats = [
    createStat("Total PRs", sectionData.totalPrs),
    createStat("Open PRs", sectionData.openPrs),
    createStat("Closed PRs", sectionData.closedPrs),
    createStat("Merged PRs", sectionData.mergedPrs),
    createStat("Rejected PRs", sectionData.rejectedPrs),
  ];

  const insights = (sectionData.keyInsights || []).flatMap((theme) => {
    const themeBullet = createBullet(theme.theme, 0);
    const prBullets = theme.prs.map((pr) =>
      createBullet(`${pr.description} (#${pr.number})`, 1)
    );
    return [themeBullet, ...prBullets];
  });

  return [
    createHeading(title, HeadingLevel.HEADING_1),
    ...stats,
    createParagraph("Key Insights:", 150, 150, true, AlignmentType.LEFT),
    ...insights,
  ];
};

// Main function
module.exports.generateDocument = async (summary) => {

  console.log(summary)

  try {
    const { startDate, endDate } = getWeekRange();
    const timelineStart = startDate.split("T")[0];
    const timelineEnd = endDate.split("T")[0];

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: FONT_FAMILY,
              size: FONT_SIZE_PARAGRAPH,
            },
          },
        },
      },
      sections: [
        {
          properties: {},
          children: [
            createHeading("Pull Request Summary", HeadingLevel.TITLE, true),
            createParagraph(`Timeline: ${timelineStart} to ${timelineEnd}`, 500, 0, false),
            ...createSection("Backend", summary.backend),
            ...createSection("Admin Panel", summary.admin),
            ...createSection("Customer Panel", summary.customerPanel),
          ],
        },
      ],
    });

    return Packer.toBuffer(doc);
  } catch (error) {
    console.error("Error generating document:", error);
  }
};
