import fs from 'fs';
import fse from 'fs-extra';
import run from '../src';
import CONFIG_FILES from '../src/configs';
import { NPM_PACKAGES_DEV, NPM_PACKAGES_PROD } from '../src/packages';

const PKG_NAME = 'hello-world';
const ROOT_DIR = process.cwd();
const PKG_DIR = `${ROOT_DIR}/${PKG_NAME}`;

describe('Create NodeJs', () => {
  beforeEach(async () => {
    await fse.remove(PKG_DIR);
  });

  afterEach(async () => {
    await fse.remove(PKG_DIR);
  });

  it('should run with bundler', async () => {
    jest.setTimeout(120000);
    expect.assertions(
      22 +
        Object.keys(CONFIG_FILES).length +
        NPM_PACKAGES_DEV.length +
        NPM_PACKAGES_PROD.length
    );

    try {
      await run({ packageName: 'hello-world', bundle: true });
      expect(fs.existsSync(PKG_DIR)).toBe(true);
      expect(fs.existsSync(`${PKG_DIR}/package.json`)).toBe(true);
      expect(fs.existsSync(`${PKG_DIR}/.git`)).toBe(true);

      Object.keys(CONFIG_FILES).forEach((k) => {
        const c = CONFIG_FILES[k];
        expect(fs.existsSync(`${PKG_DIR}/${c}`)).toBe(true);
      });

      // template source files
      expect(fs.existsSync(`${PKG_DIR}/src/index.js`)).toBe(true);
      expect(fs.existsSync(`${PKG_DIR}/tests/index.test.js`)).toBe(true);

      const contents = fs.readFileSync(`${PKG_DIR}/package.json`, 'utf-8');
      const pkg = JSON.parse(contents);
      expect(pkg.version).toBe('0.1.0');
      expect(pkg.main).toBe('lib/index.js');
      expect(pkg.license).toBe('MIT');
      expect(pkg.scripts).toHaveProperty('build:commonjs');
      expect(pkg.scripts).toHaveProperty('clean');
      expect(pkg.scripts).toHaveProperty('build');
      expect(pkg.scripts).toHaveProperty('lint');
      expect(pkg.scripts).toHaveProperty('test');
      expect(pkg.scripts).toHaveProperty('watch');
      expect(pkg.scripts).toHaveProperty('coverage');
      expect(pkg.scripts).toHaveProperty('bundle');
      expect(pkg.scripts.build).toMatch(/.*bundle$/);
      expect(pkg.author).toHaveProperty('name');
      expect(pkg.author).toHaveProperty('email');
      expect(pkg).toHaveProperty('husky');
      expect(pkg).toHaveProperty('lint-staged');
      expect(pkg).toHaveProperty('targets');

      NPM_PACKAGES_DEV.forEach((c) => {
        expect(pkg.devDependencies).toHaveProperty(c);
      });

      NPM_PACKAGES_PROD.forEach((c) => {
        expect(pkg.dependencies).toHaveProperty(c);
      });
    } catch (error) {
      // console.log(error);
      expect(error).toBe(null);
    }
  });

  it('should run without bundler', async () => {
    jest.setTimeout(120000);
    expect.assertions(
      22 +
        Object.keys(CONFIG_FILES).length +
        NPM_PACKAGES_DEV.length +
        NPM_PACKAGES_PROD.length
    );

    try {
      await run({ packageName: 'hello-world', bundle: false });
      expect(fs.existsSync(PKG_DIR)).toBe(true);
      expect(fs.existsSync(`${PKG_DIR}/package.json`)).toBe(true);
      expect(fs.existsSync(`${PKG_DIR}/.git`)).toBe(true);

      Object.keys(CONFIG_FILES).forEach((k) => {
        const c = CONFIG_FILES[k];
        expect(fs.existsSync(`${PKG_DIR}/${c}`)).toBe(true);
      });

      // template source files
      expect(fs.existsSync(`${PKG_DIR}/src/index.js`)).toBe(true);
      expect(fs.existsSync(`${PKG_DIR}/tests/index.test.js`)).toBe(true);

      const contents = fs.readFileSync(`${PKG_DIR}/package.json`, 'utf-8');
      const pkg = JSON.parse(contents);
      expect(pkg.version).toBe('0.1.0');
      expect(pkg.main).toBe('lib/index.js');
      expect(pkg.license).toBe('MIT');
      expect(pkg.scripts).toHaveProperty('build:commonjs');
      expect(pkg.scripts).toHaveProperty('clean');
      expect(pkg.scripts).toHaveProperty('build');
      expect(pkg.scripts.build).toMatch(/.*commonjs$/);
      expect(pkg.scripts).toHaveProperty('lint');
      expect(pkg.scripts).toHaveProperty('test');
      expect(pkg.scripts).toHaveProperty('watch');
      expect(pkg.scripts).toHaveProperty('coverage');
      expect(pkg.scripts).not.toHaveProperty('bundle');
      expect(pkg.author).toHaveProperty('name');
      expect(pkg.author).toHaveProperty('email');
      expect(pkg).toHaveProperty('husky');
      expect(pkg).toHaveProperty('lint-staged');
      expect(pkg).not.toHaveProperty('targets');

      NPM_PACKAGES_DEV.forEach((c) => {
        expect(pkg.devDependencies).toHaveProperty(c);
      });

      NPM_PACKAGES_PROD.forEach((c) => {
        expect(pkg.dependencies).toHaveProperty(c);
      });
    } catch (error) {
      // console.log(error);
      expect(error).toBe(null);
    }
  });

  it('should NOT run', async () => {
    expect.assertions(1);
    try {
      await run({ packageName: 'src' });
    } catch (error) {
      expect(error.message).toEqual('Error: The directory exists.');
    }
  });
});
