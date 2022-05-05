# BuboJS

## Contribution

### Install

Install modules using lerna bootstrap to centralize all modules in root node_modules.

```bash
lerna bootstrap
```

### Build

It's necessary to build ts files into js files to execute them
This command remove previous build dir and build them with tsc compiler

```bash
yarn build
```

### Run tests

Jest run all \*.test.ts files in packages/\* dir
⚠️You should build packages to execute tests⚠️

```bash
yarn test
```
