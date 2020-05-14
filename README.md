# Create NodeJs

[![ver](https://img.shields.io/npm/v/@kdcsoftware/create-nodejs?style=for-the-badge)](https://www.npmjs.com/package/@kdcsoftware/create-nodejs)
[![build](https://img.shields.io/github/workflow/status/kdcsoftware/create-nodejs/build?style=for-the-badge)](https://github.com/kdcsoftware/create-nodejs/actions?query=workflow%3Abuild)
[![codecov](https://img.shields.io/codecov/c/github/kdcsoftware/create-nodejs?style=for-the-badge)](https://codecov.io/gh/kdcsoftware/create-nodejs)
[![size](https://img.shields.io/bundlephobia/min/@kdcsoftware/create-nodejs?style=for-the-badge)](https://bundlephobia.com/result?p=@kdcsoftware/create-nodejs)
[![license](https://img.shields.io/github/license/kdcsoftware/create-nodejs?style=for-the-badge)](https://github.com/kdcsoftware/create-nodejs/blob/master/LICENSE)

Start you project easily with the right tools and best practices.

## Usage

```terminal
  _  ______   ____ ____         __ _
 | |/ /  _ \ / ___/ ___|  ___  / _| |___      ____ _ _ __ ___
 | ' /| | | | |   \___ \ / _ \| |_| __\ \ /\ / / _` | '__/ _ \
 | . \| |_| | |___ ___) | (_) |  _| |_ \ V  V / (_| | | |  __/
 |_|\_\____/ \____|____/ \___/|_|  \__| \_/\_/ \__,_|_|  \___|

Usage: npx @kdcsoftware/create-nodejs package-name

Options:
  -V, --version                  output the version number
  --no-bundle                    do not bundle the build output
  -g, --git-origin <remote-url>  add git remote url as origin
  -i, --info                     print environment debug info
  -h, --help                     display help for command

Example:
  npx @kdcsoftware/create-nodejs my-awesome-package

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
