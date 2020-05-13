import fs from 'fs';
import fse from 'fs-extra';
import execa from 'execa';
import { resolve } from 'path';
import cmd from './cmd';

import pkg from './pkg';
import CONFIG_FILES from './configs';
import { NPM_PACKAGES_DEV, NPM_PACKAGES_PROD } from './packages';

const PKG_DIR = __dirname;

const run = async ({ packageName }) => {
  if (fs.existsSync(packageName)) {
    throw new Error('The directory exists.');
  }

  try {
    await fse.mkdirp(packageName);
    process.chdir(packageName);
    const CUR_DIR = process.cwd();

    // npm commands
    await cmd('npm', ['init', '-y']);
    // dev dependencies
    await cmd('npm', ['i', '-D', ...NPM_PACKAGES_DEV]);
    // prod dependencies
    await cmd('npm', ['i', ...NPM_PACKAGES_PROD]);

    // copy config
    Object.keys(CONFIG_FILES).forEach((k) => {
      const c = CONFIG_FILES[k];
      fse.copySync(
        resolve(`${PKG_DIR}/..`, `templates/${k}`),
        `${CUR_DIR}/${c}`
      );
    });

    // copy source templates
    fse.copySync(
      resolve(`${PKG_DIR}/..`, 'templates/src/index.js'),
      `${CUR_DIR}/src/index.js`
    );
    fse.copySync(
      resolve(`${PKG_DIR}/..`, 'templates/tests/index.test.js'),
      `${CUR_DIR}/tests/index.test.js`
    );

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

    const { stdout: userName } = await execa('git', ['config', 'user.name']);
    const { stdout: email } = await execa('git', ['config', 'user.email']);
    pkg.mod([{ field: 'author', value: { name: userName, email } }]);

    // Initialize git
    await cmd('git', ['init']);
    await cmd('git', ['add', '.']);
    await cmd('git', ['commit', '-m', 'first commit']);
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  } finally {
    // go back to root dir
    process.chdir('..');
  }
};

export default run;
