import fs from 'fs';
import fse from 'fs-extra';
import run from '../src';

const PKG_NAME = 'hello-world';
const ROOT_DIR = process.cwd();
const PKG_DIR = `${ROOT_DIR}/${PKG_NAME}`;

describe('Create NodeJs', () => {
  beforeAll(async () => {
    await fse.remove(PKG_DIR);
  });

  afterAll(async () => {
    // await fse.remove(PKG_DIR);
  });

  it('should run', async () => {
    expect.assertions(7);
    try {
      await run({ packageName: 'hello-world' });
      expect(fs.existsSync(PKG_DIR)).toBe(true);
      expect(fs.existsSync(`${PKG_DIR}/package.json`)).toBe(true);

      const contents = fs.readFileSync(`${PKG_DIR}/package.json`, 'utf-8');
      const pkg = JSON.parse(contents);
      expect(pkg.version).toBe('0.1.0');
      expect(pkg.main).toBe('lib/index.js');
      expect(pkg.license).toBe('MIT');
      expect(pkg.author.name).toBe('Ian Dela Cruz');
      expect(pkg.author.email).toBe('iandc76@gmail.com');
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
