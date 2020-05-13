#!/usr/bin/env node

/* eslint-disable no-console */
const chalk = require('chalk');
const envinfo = require('envinfo');
const { program } = require('commander');
const run = require('./lib/index').default;

const packageJson = require('./package.json');

let packageName;

program
  .version(packageJson.version)
  .name('npx @kdcsoftware/create-nodejs')
  .usage(`${chalk.green('<package-name>')}`)
  .arguments('<package-name>')
  .option('--info', 'print environment debug info')
  .action((name) => {
    packageName = name;
  })
  .parse(process.argv);

if (program.info) {
  console.log(chalk.bold('\nEnvironment Info:'));
  console.log(
    `\n  current version of ${packageJson.name}: ${packageJson.version}`
  );
  console.log(`  running from ${__dirname}`);
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
    .then(console.log);
} else if (typeof packageName === 'undefined') {
  console.error('Please specify the project directory:');
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
  );
  console.log();
  console.log('For example:');
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('my-awesome-package')}`
  );
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  );
  process.exit(1);
} else {
  run({ packageName });
}
