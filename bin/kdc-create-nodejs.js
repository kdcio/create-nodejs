#!/usr/bin/env node

const { program } = require('commander');

program
  .name('npx @kdcsoftware/create-nodejs')
  .usage('<package-name>')
  .arguments('<package-name>', 'Name of your package')
  .action(function (packageName) {
    // console.log(packageName);
    require('../lib')({ packageName });
  });
program.parse(process.argv);
