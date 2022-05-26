/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  coverageProvider: 'v8',

  testEnvironment: 'jsdom',
  transform: {
    //'^.+\\.tsx?$': 'ts-jest',
    //'^.+\\.jsx?$': 'babel-jest',
    '^.+\\.[jt]sx?$': '<rootDir>/jest-preprocess.js',
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/src/__mocks__/file-mock.js`,
    '^gatsby-page-utils/(.*)$': `gatsby-page-utils/dist/$1`, // Workaround for https://github.com/facebook/jest/issues/9771
    '^gatsby-core-utils/(.*)$': `gatsby-core-utils/dist/$1`, // Workaround for https://github.com/facebook/jest/issues/9771
    '^gatsby-plugin-utils/(.*)$': [`gatsby-plugin-utils/dist/$1`, `gatsby-plugin-utils/$1`], // Workaround for https://github.com/facebook/jest/issues/9771
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [
    '/node_modules/(?!' +
      'gatsby|refractor' +
      '|unified|micromark|remark|rehype' +
      '|unist|mdast-util|hast-|hastscript|vfile' +
      '|web-namespaces|html-void-elements' +
      '|decode-named-character-reference|character-reference-invalid' +
      '|space-separated-tokens|comma-separated-tokens' +
      '|parse-entities|character-entities' +
      '|bail|trough|property-information|zwitch|ccount|escape-string-regexp|markdown-table|longest-streak' +
      '|is-plain-obj|is-decimal|is-hexadecimal|is-alphanumerical|is-alphabetica' +
      ')',
  ],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testURL: 'http://localhost',
  setupFiles: [
    `<rootDir>/loadershim.js`,
    `<rootDir>/test.setup.js`,
    `<rootDir>/jest-fix-instanceof-error.js`,
  ],
};
