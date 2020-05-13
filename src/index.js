import fs from 'fs';
import fse from 'fs-extra';
import execa from 'execa';

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
    await execa('npm', ['init', '-y']);
    // dev dependencies
    const npmProcDev = execa('npm', ['i', '-D', ...NPM_PACKAGES_DEV]);
    npmProcDev.stdout.pipe(process.stdout);
    await npmProcDev;
    // prod dependencies
    const npmProcProd = execa('npm', ['i', ...NPM_PACKAGES_PROD]);
    npmProcProd.stdout.pipe(process.stdout);
    await npmProcProd;

    // copy config
    CONFIG_FILES.forEach((c) => {
      fse.copySync(`${PKG_DIR}/../${c}`, `${CUR_DIR}/${c}`);
    });

    // copy source templates
    fse.copySync(
      `${PKG_DIR}/../templates/src/index.js`,
      `${CUR_DIR}/src/index.js`
    );
    fse.copySync(
      `${PKG_DIR}/../templates/tests/index.test.js`,
      `${CUR_DIR}/tests/index.test.js`
    );

    pkg.mod([
      { field: 'version', value: '0.1.0' },
      { field: 'main', value: 'lib/index.js' },
      { field: 'license', value: 'MIT' },
    ]);

    if (!process.env.CI) {
      const { stdout: userName } = await execa('git', ['config', 'user.name']);
      const { stdout: email } = await execa('git', ['config', 'user.email']);
      pkg.mod([{ field: 'author', value: { name: userName, email } }]);
    }
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  } finally {
    // go back to root dir
    process.chdir('..');
  }
};

export default run;
