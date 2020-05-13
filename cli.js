#!/usr/bin/env node

const { program } = require('commander');
const run = require('./lib/index').default;

program
  .name('npx @kdcsoftware/create-nodejs')
  .usage('<package-name>')
  .arguments('<package-name>', 'Name of your package')
  .action(function (packageName) {
    // console.log(packageName);
    run({ packageName });
  });

program.parse(process.argv);
