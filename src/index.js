import fs from 'fs';
import fse from 'fs-extra';
import execa from 'execa';

import pkg from './pkg';

// const NPM_PACKAGES = [
//   '@babel/core',
//   '@babel/cli',
//   '@babel/preset-env',
//   'eslint',
//   'prettier',
//   'babel-eslint',
//   'eslint-plugin-import',
//   'eslint-plugin-prettier',
//   'eslint-config-airbnb-base',
//   'eslint-config-prettier',
//   'husky',
//   'lint-staged',
//   'pretty-quick',
//   'jest',
//   'babel-jest',
//   '@babel/plugin-transform-runtime',
//    '@types/jest',
// ];

// const PKG_DIR = __dirname;
// const CUR_DIR = process.cwd();

const run = async ({ packageName }) => {
  if (fs.existsSync(packageName)) {
    throw new Error('The directory exists.');
  }

  try {
    await fse.mkdirp(packageName);
    process.chdir(packageName);
    await execa('npm', ['init', '-y']);
    const { stdout: userName } = await execa('git', ['config', 'user.name']);
    const { stdout: email } = await execa('git', ['config', 'user.email']);
    pkg.mod([
      { field: 'version', value: '0.1.0' },
      { field: 'main', value: 'lib/index.js' },
      { field: 'license', value: 'MIT' },
      { field: 'author', value: { name: userName, email } },
    ]);

    // pkg.mod({ field: 'main', value: 'lib/index.js' });

    // console.log('hello');
    // init dir
    // init git
    // npm install
    // copy configs
    // fs.mkdir('mydir');
    // get user from git
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  } finally {
    // go back to root dir
    process.chdir('..');
  }
};

export default run;
