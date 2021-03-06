#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');
const envinfo = require('envinfo');
const { program } = require('commander');
// eslint-disable-next-line import/no-unresolved
const run = require('./lib/index').default;
const packageJson = require('./package.json');

const { log } = console;

let packageName;

log(
  figlet.textSync('KDCio', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  })
);
log(`Running version: ${chalk.green(packageJson.version)}`);
log(); // blank line

program
  .version(packageJson.version)
  .name(`npx ${packageJson.name}`)
  .usage(`${chalk.green('package-name')}`)
  .arguments('[package-name]')
  .option('--no-bundle', 'do not bundle the build output')
  .option('-g, --git-origin <remote-url>', 'add git remote url as origin')
  .option('-i, --info', 'print environment debug info')
  .option('-v, --verbose', 'verbose output')
  .action((name) => {
    packageName = name;
  })
  .on('--help', () => {
    log('');
    log('Example:');
    log(`  ${chalk.cyan(program.name())} ${chalk.green('my-awesome-package')}`);
  })
  .parse(process.argv);

const createPackage = async () => {
  try {
    const { bundle, gitOrigin, verbose } = program;
    await run({ packageName, bundle, gitOrigin, verbose });
    log(chalk.green('\n\nYour package is ready!\n\n'));
    log(chalk.blue(`\tcd ${packageName}`));
    log(chalk.blue('\tcode .\n\n'));
    log(chalk.green.bold(`Enjoy coding!`));
  } catch (error) {
    log(chalk.red(chalk.bold('Error: '), error.message));
  }
};

if (program.info) {
  log(chalk.bold('\nEnvironment Info:'));
  log(`\n  current version of ${packageJson.name}: ${packageJson.version}`);
  log(`  running from ${__dirname}`);
  envinfo
    .run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'npm', 'Yarn'],
        Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
        npmGlobalPackages: [`${packageJson.name}`],
      },
      {
        duplicates: true,
        showNotFound: true,
      }
    )
    .then(log);
} else if (typeof packageName === 'undefined') {
  // eslint-disable-next-line no-console
  console.error('Please specify the project name:');
  log(`  ${chalk.cyan(program.name())} ${chalk.green('project-directory')}`);
  log();
  log('For example:');
  log(`  ${chalk.cyan(program.name())} ${chalk.green('my-awesome-package')}`);
  log();
  log(`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`);
  process.exit(1);
} else {
  createPackage();
}
