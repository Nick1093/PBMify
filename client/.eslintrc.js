module.exports = {
  parserOptions: {
    ecmaVersion: 2021, // or whatever version you are targeting
    sourceType: "module", // Set sourceType to module to allow import/export syntax
    ecmaFeatures: {
      jsx: true, // If you are using React and writing JSX
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true, // If you're using Node.js features
  },
  extends: [
    // your other extends like 'eslint:recommended', 'plugin:react/recommended', etc.
  ],
  rules: {
    // your rules
  },
};
