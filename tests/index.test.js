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
    await run({ packageName: 'hello-world' });
    expect(fs.existsSync(PKG_DIR)).toBe(true);
  });
});
