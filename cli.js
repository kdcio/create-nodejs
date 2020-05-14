#!/usr/bin/env node

const chalk = require('chalk');
const envinfo = require('envinfo');
const { program } = require('commander');
const run = require('./lib/index').default;
const packageJson = require('./package.json');

const { log } = console;

let packageName;

program
  .version(packageJson.version)
  .name('npx @kdcsoftware/create-nodejs')
  .usage(`${chalk.green('<package-name>')}`)
  .arguments('<package-name>')
  .option('--info', 'print environment debug info')
  .option('--no-bundle', 'do not bundle the build output')
  .action((name) => {
    packageName = name;
  })
  .parse(process.argv);

const createPackage = async () => {
  try {
    const { bundle } = program;
    await run({ packageName, bundle });
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
        npmGlobalPackages: ['@kdcsoftware/create-nodejs'],
      },
      {
        duplicates: true,
        showNotFound: true,
      }
    )
    .then(log);
} else if (typeof packageName === 'undefined') {
  console.error('Please specify the project directory:');
  log(`  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`);
  log();
  log('For example:');
  log(`  ${chalk.cyan(program.name())} ${chalk.green('my-awesome-package')}`);
  log();
  log(`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`);
  process.exit(1);
} else {
  createPackage();
}
