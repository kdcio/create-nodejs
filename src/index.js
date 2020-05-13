import fs from 'fs';
import fse from 'fs-extra';
import { resolve } from 'path';
import chalk from 'chalk';
import cmd from './cmd';

import pkg from './pkg';
import CONFIG_FILES from './configs';
import { NPM_PACKAGES_DEV, NPM_PACKAGES_PROD } from './packages';

const { log } = console;

const PKG_DIR = __dirname;

const run = async ({ packageName }) => {
  try {
    log(chalk.green.bold('Creating your package...'));
    log(chalk`Package Name: {blue ${packageName}}`);

    if (fs.existsSync(packageName)) {
      throw new Error('The directory exists.');
    }

    log(chalk.green('Creating directory...'));
    await fse.mkdirp(packageName);
    process.chdir(packageName);
    const CUR_DIR = process.cwd();

    log(chalk.green('Initializing npm...'));
    await cmd('npm', ['init', '-y']);

    log(chalk.green('Installing dev dependencies...'));
    await cmd('npm', ['i', '-D', ...NPM_PACKAGES_DEV]);

    log(chalk.green('Installing prod dependencies...'));
    await cmd('npm', ['i', ...NPM_PACKAGES_PROD]);

    log(chalk.green('Copying configuration files...'));
    Object.keys(CONFIG_FILES).forEach((k) => {
      const c = CONFIG_FILES[k];
      fse.copySync(
        resolve(`${PKG_DIR}/..`, `templates/${k}`),
        `${CUR_DIR}/${c}`
      );
    });

    log(chalk.green('Copying source files...'));
    fse.copySync(
      resolve(`${PKG_DIR}/..`, 'templates/src/index.js'),
      `${CUR_DIR}/src/index.js`
    );
    fse.copySync(
      resolve(`${PKG_DIR}/..`, 'templates/tests/index.test.js'),
      `${CUR_DIR}/tests/index.test.js`
    );

    log(chalk.green('Updating package.json...'));
    const scripts = {
      'build:commonjs': 'babel src --out-dir lib',
      clean: 'rm -fR lib',
      build: 'npm run clean && npm run build:commonjs',
      lint: 'eslint src --ext .js',
      test: 'jest',
      watch: 'jest --watchAll --runInBand',
      coverage: 'jest --coverage',
    };

    pkg.mod([
      { field: 'version', value: '0.1.0' },
      { field: 'main', value: 'lib/index.js' },
      { field: 'license', value: 'MIT' },
      { field: 'scripts', value: scripts },
    ]);

    const { stdout: userName } = await cmd(
      'git',
      ['config', 'user.name'],
      false
    );
    const { stdout: email } = await cmd('git', ['config', 'user.email'], false);
    pkg.mod([{ field: 'author', value: { name: userName, email } }]);

    log(chalk.green('Initializing git...'));
    await cmd('git', ['init']);
    await cmd('git', ['add', '.']);
    await cmd('git', ['commit', '-m', 'first commit']);
  } catch (error) {
    throw new Error(error);
  } finally {
    // go back to root dir
    process.chdir('..');
  }
};

export default run;
