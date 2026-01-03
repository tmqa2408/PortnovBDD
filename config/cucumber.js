module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    dryRun: false,
    require: ['steps/**/*.ts', 'support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress',
      'summary',
      'json:reports/cucumber-report.json',
      "allure-cucumberjs/reporter"
    ],
    formatOptions: {
      colorsEnabled: true
    },
    publishQuiet: true,
    worldParameters: {
      snippetInterface: 'async-await'
    }
  }
};