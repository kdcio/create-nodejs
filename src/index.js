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

const run = async ({ packageName, bundle, gitOrigin, verbose }) => {
  try {
    log(chalk.green.bold('Creating your package...'));
    log(chalk`Package Name: {blue ${packageName}}`);

    if (verbose) {
      log(chalk`Source: {blue ${PKG_DIR}}`);
      log(chalk`Destination: {blue ${process.cwd()}/${packageName}}`);
    }

    if (fs.existsSync(packageName)) {
      throw new Error('The directory exists.');
    }

    log(chalk.green('Creating directory...'));
    await fse.mkdirp(packageName);
    process.chdir(packageName);
    const CUR_DIR = process.cwd();

    log(chalk.green('Initializing git...'));
    await cmd('git', ['init']);

    log(chalk.green('Initializing npm...'));
    await cmd('npm', ['init', '-y']);

    log(chalk.green('Installing dev dependencies...'));
    const devDeps = [...NPM_PACKAGES_DEV];
    if (bundle) devDeps.push('parcel@next');
    if (verbose) log(chalk.gray(devDeps));
    await cmd('npm', ['i', '-D', ...devDeps]);

    log(chalk.green('Installing prod dependencies...'));
    if (verbose) log(chalk.gray(NPM_PACKAGES_PROD));
    await cmd('npm', ['i', ...NPM_PACKAGES_PROD]);

    let src;
    let dest;
    log(chalk.green('Copying configuration files...'));
    Object.keys(CONFIG_FILES).forEach((k) => {
      const c = CONFIG_FILES[k];
      src = resolve(`${PKG_DIR}`, `../templates/${k}`);
      dest = `${CUR_DIR}/${c}`;
      if (verbose) log(`Copying ${chalk.yellow(src)} to ${chalk.green(dest)}`);
      fse.copySync(src, dest);
    });

    log(chalk.green('Copying source files...'));
    src = resolve(`${PKG_DIR}`, '../templates/src/index.js');
    dest = `${CUR_DIR}/src/index.js`;
    if (verbose) log(`Copying ${chalk.yellow(src)} to ${chalk.green(dest)}`);
    fse.copySync(src, dest);
    src = resolve(`${PKG_DIR}`, '../templates/tests/index.test.js');
    dest = `${CUR_DIR}/tests/index.test.js`;
    if (verbose) log(`Copying ${chalk.yellow(src)} to ${chalk.green(dest)}`);
    fse.copySync(src, dest);

    log(chalk.green('Updating package.json...'));
    const mods = [];
    mods.push({ field: 'version', value: '0.1.0' });
    mods.push({ field: 'main', value: 'lib/index.js' });
    mods.push({ field: 'license', value: 'MIT' });

    const scripts = {
      'build:commonjs': 'babel src --out-dir lib',
      clean: 'rm -fR lib',
      build: 'npm run clean && npm run build:commonjs',
      lint: 'eslint src --ext .js',
      test: 'jest',
      watch: 'jest --watchAll --runInBand',
      coverage: 'jest --coverage',
    };

    if (bundle) {
      if (verbose) log(chalk.gray(`Including bundler configs`));
      scripts.bundle = 'parcel build src/index.js';
      scripts.build = 'npm run clean && npm run bundle';
      mods.push({
        field: 'targets',
        value: {
          main: {
            engines: {
              node: '>=10.x',
            },
          },
        },
      });
    }

    mods.push({ field: 'scripts', value: scripts });

    const { stdout: userName } = await cmd(
      'git',
      ['config', 'user.name'],
      false
    );
    const { stdout: email } = await cmd('git', ['config', 'user.email'], false);
    mods.push({ field: 'author', value: { name: userName, email } });

    mods.push({
      field: 'husky',
      value: {
        hooks: {
          'pre-commit': 'lint-staged',
        },
      },
    });

    mods.push({
      field: 'lint-staged',
      value: {
        '*.js': [
          'eslint src --ext .js --fix',
          'pretty-quick --staged',
          'git add',
        ],
      },
    });

    pkg.mod(mods);

    log(chalk.green('Adding files to git...'));
    await cmd('git', ['add', '.']);
    await cmd('git', ['commit', '-m', 'first commit']);

    if (gitOrigin) {
      if (verbose) log(chalk.gray(`Adding git remote`));
      await cmd('git', ['remote', 'add', 'origin', gitOrigin]);
    }
  } catch (error) {
    throw new Error(error);
  } finally {
    // go back to root dir
    process.chdir('..');
  }
};

export default run;
