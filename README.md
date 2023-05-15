# Cypress newsletter example

## Installation:

- clone the git repo with

  ```bash
  $ git clone *repo link*
  ```

- install dependencies:
  ```bash
  $ npm install
  ```
- run command for testing (package.json):
  ```bash
  $ npm run test:cy
  ```

## Configuration:

- baseURL is set in **cypress.config.ts**

## Folder Structure:

- cypress
  - e2e - contains test files
  - fixture - contains fixture file for testing, ppossible fixture data (like email & passwords for the default users)
  - support
    - commands.ts - contains custom cypress commands
    - e2e.ts - for importing the plugins

## Additional plugins

- [cypress-file-upload](https://www.npmjs.com/package/cypress-file-upload) (for testing the file uploading)
- [4tw/cypress-drag-drop
  ](https://www.npmjs.com/package/@4tw/cypress-drag-drop) (plugin for executing drag'n'drop as it's not embedded method in Cypress)
- [faker](https://www.npmjs.com/package/@faker-js/faker) (for generating fake data)
