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
    await fse.remove(PKG_DIR);
  });

  it('should run', async () => {
    expect.assertions(2);
    try {
      await run({ packageName: 'hello-world' });
      expect(fs.existsSync(PKG_DIR)).toBe(true);
      expect(fs.existsSync(`${PKG_DIR}/package.json`)).toBe(true);
    } catch (error) {
      // console.log(error);
      expect(error).toBe(undefined);
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
