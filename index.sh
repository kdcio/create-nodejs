#!/bin/bash

mkdir package-name
cd package-name
npm init -y

echo "# package-name" >> README.md
git init
git add package.json
git add README.md
git commit -m "first commit"

copy .gitignore
copy .editorconfig

npm i -D @babel/core @babel/cli @babel/preset-env

copy .babelrc

npm i -D eslint prettier babel-eslint eslint-plugin-import eslint-plugin-prettier eslint-config-airbnb-base eslint-config-prettier

copy .eslintrc
copy .prettierrc

npm i -D husky lint-staged pretty-quick

npm i -D jest babel-jest @babel/plugin-transform-runtime


# add package.json husky

