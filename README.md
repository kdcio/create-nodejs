# Create NodeJs

Start your [NodeJs](https://nodejs.org/) project easily with the right tools and best practices.

[![ver](https://img.shields.io/npm/v/@kdcio/create-nodejs?style=for-the-badge)](https://www.npmjs.com/package/@kdcio/create-nodejs)
[![build](https://img.shields.io/github/workflow/status/kdcio/create-nodejs/build?style=for-the-badge)](https://github.com/kdcio/create-nodejs/actions?query=workflow%3Abuild)
[![codecov](https://img.shields.io/codecov/c/github/kdcio/create-nodejs?style=for-the-badge)](https://codecov.io/gh/kdcio/create-nodejs)
[![size](https://img.shields.io/bundlephobia/min/@kdcio/create-nodejs?style=for-the-badge)](https://bundlephobia.com/result?p=@kdcio/create-nodejs)
[![license](https://img.shields.io/github/license/kdcio/create-nodejs?style=for-the-badge)](https://github.com/kdcio/create-nodejs/blob/master/LICENSE)

## Usage

```terminal
  _  ______   ____ ____         __ _
 | |/ /  _ \ / ___/ ___|  ___  / _| |___      ____ _ _ __ ___
 | ' /| | | | |   \___ \ / _ \| |_| __\ \ /\ / / _` | '__/ _ \
 | . \| |_| | |___ ___) | (_) |  _| |_ \ V  V / (_| | | |  __/
 |_|\_\____/ \____|____/ \___/|_|  \__| \_/\_/ \__,_|_|  \___|

Usage: npx @kdcio/create-nodejs package-name

Options:
  -V, --version                  output the version number
  --no-bundle                    do not bundle the build output
  -g, --git-origin <remote-url>  add git remote url as origin
  -i, --info                     print environment debug info
  -v, --verbose                  verbose output
  -h, --help                     display help for command

Example:
  npx @kdcio/create-nodejs my-awesome-package

```

## What's included

### Packages Installed

- [babel](https://babeljs.io/)
- [eslint](https://eslint.org/)
- [prettier](https://prettier.io/)
- [jest](https://jestjs.io/)
- [husky](https://github.com/typicode/husky)
- [lint-staged](https://github.com/okonet/lint-staged)
- [parcel](https://parceljs.org/)

### Scripts

- Build script
- Bundler script
- Sample test script
- GitHub Actions for merging and publishing
- Initialize git and add remote url
- Add info in package.json
- Debug jest test scripts using VS Code
