import fs from 'fs';
import fse from 'fs-extra';
import run from '../src';
import CONFIG_FILES from '../src/configs';
import { NPM_PACKAGES_DEV, NPM_PACKAGES_PROD } from '../src/packages';

const PKG_NAME = 'hello-world';
const ROOT_DIR = process.cwd();
const PKG_DIR = `${ROOT_DIR}/${PKG_NAME}`;

describe('Create NodeJs', () => {
  beforeAll(async () => {
    await fse.remove(PKG_DIR);
  });

  afterAll(async () => {
    await fse.remove(PKG_DIR);
  });

  it('should run', async () => {
    jest.setTimeout(60000);
    expect.assertions(
      14 +
        CONFIG_FILES.length +
        NPM_PACKAGES_DEV.length +
        NPM_PACKAGES_PROD.length
    );
    try {
      await run({ packageName: 'hello-world' });
      expect(fs.existsSync(PKG_DIR)).toBe(true);
      expect(fs.existsSync(`${PKG_DIR}/package.json`)).toBe(true);

      CONFIG_FILES.forEach((c) => {
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
      // Remove from test since CI doesn't have git user
      // expect(pkg.author.name).toBe('Ian Dela Cruz');
      // expect(pkg.author.email).toBe('iandc76@gmail.com');

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
      expect(error.message).toEqual('The directory exists.');
    }
  });
});
