const { Command, flags } = require("@oclif/command");
const chalk = require("chalk");
const CFonts = require("cfonts");
const Pie = require("cli-pie");
const Table = require("cli-table3");
const extractCss = require("extract-css-core");
const groupBy = require("lodash.groupBy");
const startCase = require("lodash.startcase");
const sortBy = require("lodash.sortby");
const ora = require("ora");
const postcss = require("postcss");
const pxToRem = require("postcss-pxtorem");
const expandShorthand = require("postcss-shorthand-expand");

const tokens = require("../stubs/tokens");
const { validateSpecs } = require("../utils");
const scorecard = require("../../packages/postcss");
const { types } = require("../../packages/css-types");

let invalidScores = [];
let validScores = [];

function getPrintableValue(value) {
  if (!parseInt(value) && value.isValid && value.isValid()) {
    return chalk.hex(value.toHexString())(value.toHexString());
  }

  return chalk.whiteBright(value);
}

function generateUnofficialTable() {
  const result = new Table({
    head: [
      "Type",
      "Attribute",
      "Unofficial Value",
      "Nearest Official Value",
    ].map((x) => chalk.blueBright(x)),
    colWidths: [25, 25, 25, 25],
  });

  sortBy(
    invalidScores.filter(({ type }) => type !== types.UNKNOWN),
    ["type", "prop"]
  ).forEach((score) => {
    result.push([
      chalk.whiteBright(startCase(score.type.toLowerCase())),
      chalk.whiteBright(score.prop),
      getPrintableValue(score.value),
      getPrintableValue(score.nearestValue),
    ]);
  });

  return result;
}

function groupScoresByType(scores) {
  return Object.entries(groupBy(scores, (score) => score.type));
}

function getCorrectAmount(groupedValidScores, invalidType) {
  const matchingValidGroup = groupedValidScores.find(([validType]) => {
    return validType === invalidType;
  });

  const hasSomeCorrectScores = matchingValidGroup && matchingValidGroup.length;
  if (!hasSomeCorrectScores) {
    return 0;
  }

  const [_, scores] = matchingValidGroup;
  return scores.length;
}

function generateSummaryTable() {
  const result = new Table({
    head: ["Category", "Correct", "Incorrect", "Percentage"].map((x) =>
      chalk.blueBright(x)
    ),
    colWidths: [15, 15, 15, 55],
  });

  const groupedInvalidScores = groupScoresByType(
    invalidScores.filter(({ type }) => {
      return type !== types.UNKNOWN;
    })
  );
  const groupedValidScores = groupScoresByType(
    validScores.filter(({ type }) => {
      return type !== types.UNKNOWN;
    })
  );
  
  const pieRadius = 5;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  
  groupedInvalidScores.forEach(([type, scores]) => {
    const incorrectAmount = scores.length;
    const correctAmount = getCorrectAmount(groupedValidScores, type);
    const percentagePie = new Pie(
      pieRadius,
      [
        { label: "Correct", value: correctAmount },
        { label: "Incorrect", value: incorrectAmount },
      ],
      { legend: true }
    );

    result.push([
      chalk.whiteBright(startCase(type.toLowerCase())),
      chalk.greenBright(correctAmount),
      chalk.redBright(incorrectAmount),
      percentagePie.toString(),
    ]);

    totalCorrect = totalCorrect + correctAmount;
    totalIncorrect = totalIncorrect + incorrectAmount;
  });

  const percentagePie = new Pie(
    pieRadius,
    [
      { label: "Correct", value: totalCorrect },
      { label: "Incorrect", value: totalIncorrect },
    ],
    { legend: true }
  );
  
  result.push([
    chalk.whiteBright("Total"),
    chalk.greenBright(totalCorrect),
    chalk.redBright(totalIncorrect),
    percentagePie.toString(),
  ]);

  return result;
}

function getSummaryTables() {
  return [generateUnofficialTable(), generateSummaryTable()];
}

function getGrade(percentage) {
  const A_MINUS = 93;
  const B_MINUS = 85;
  const C_MINUS = 75;
  const D_MINUS = 70;

  if (percentage >= A_MINUS) {
    return "A";
  }
  else if (percentage >= B_MINUS) {
    return "B";
  }
  else if (percentage >= C_MINUS) {
    return "C";
  } 
  else if (percentage >= D_MINUS) {
    return "D";
  } 
  else {
    return "F";
  }
}

class ScorecardCommand extends Command {
  async run() {
    const { flags } = this.parse(ScorecardCommand);
    const site = flags.site;
    try {
      new URL(site);
    } catch (error) {
      this.error(
        chalk.redBright(`The provide site is not a valid url: ${site}`)
      );
    }

    if (!validateSpecs(tokens)) {
      this.error(
        `The provided specs are not valid. The specs should be formatted as key-value tokens: ${tokens}`
      );
    }

    CFonts.say("Design|Scorecard", {
      font: "block",
      align: "center",
      colors: ["system"],
      background: "transparent",
      gradient: ["red", "blue"],
    });

    const css = await extractCss(site);

    const spinner = ora(`Analyzing ${chalk.blueBright(site)}...\n`).start();

    await postcss()
      .use(pxToRem)
      .use(expandShorthand)
      .use(
        scorecard({
          onFinished: () => {
            spinner.succeed();

            const [unofficialTable, summaryTable] = getSummaryTables();

            CFonts.say("Unofficial", {
              font: "grid",
              align: "left",
              colors: ["yellow", "#333"],
              background: "transparent",
            });
            this.log(unofficialTable.toString());

            CFonts.say("Scoring", {
              font: "grid",
              align: "left",
              colors: ["red", "#333"],
              background: "transparent",
            });
            this.log(summaryTable.toString());

            CFonts.say("Grade", {
              font: "grid",
              align: "left",
              colors: ["cyan", "#333"],
              background: "transparent",
            });
            const percentage = ((validScores.length / invalidScores.length) * 100).toFixed(2); 
            const grade = getGrade(percentage);
            CFonts.say(grade, {
              font: "block",
              align: "left",
              colors: ["system"],
              background: "transparent",
            });
          },
          onInvalid: (score) => {
            invalidScores.push(score);
          },
          onValid: (score) => {
            validScores.push(score);
          },
          specs: tokens,
        })
      )
      .process(css, { from: undefined });
  }
}

ScorecardCommand.description = `analyze adoption of a design system 
...
Scorecard analyzes a web app or web page, collecting 
design system adoption metrics and insights for adoption.
`;

ScorecardCommand.flags = {
  site: flags.string({ char: "s", description: "site url to analyze" }),
};

ScorecardCommand.title = "Scorecard";

module.exports = ScorecardCommand;
