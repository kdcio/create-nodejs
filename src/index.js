import fs from 'fs';
import fse from 'fs-extra';
import execa from 'execa';

import pkg from './pkg';
import CONFIG_FILES from './configs';
import NPM_PACKAGES from './packages';

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
    await execa('npm', ['init', '-y']);
    const npmProc = execa('npm', ['i', '-D', ...NPM_PACKAGES]);
    const { stdout: npmInstall } = await npmProc;
    console.log('npm install output:', npmInstall);

    // copy config
    CONFIG_FILES.forEach((c) => {
      fse.copySync(`${PKG_DIR}/../${c}`, `${CUR_DIR}/${c}`);
    });

    // modify package.json
    const { stdout: userName } = await execa('git', ['config', 'user.name']);
    const { stdout: email } = await execa('git', ['config', 'user.email']);
    pkg.mod([
      { field: 'version', value: '0.1.0' },
      { field: 'main', value: 'lib/index.js' },
      { field: 'license', value: 'MIT' },
      { field: 'author', value: { name: userName, email } },
    ]);

    // add sample test
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  } finally {
    // go back to root dir
    process.chdir('..');
  }
};

export default run;
