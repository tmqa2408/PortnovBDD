// config/cucumber.js
module.exports = {
  default: {
    paths: [
      "features/**/*.feature"
    ],

    dryRun: false,

    require: [
      "steps/**/*.ts",
      "support/**/*.ts"
    ],

    requireModule: [
      "ts-node/register"
    ],

    format: [
      "progress-bar",
      "summary",
      "json:reports/cucumber-report.json",
      "html:reports/cucumber-report.html"
    ],

    formatOptions: {
      colorsEnabled: true,
      snippetInterface: "async-await"
    },

    publishQuiet: true
  }
};
