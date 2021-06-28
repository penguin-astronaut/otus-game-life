module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "jest", "prettier"],
  rules: {
    "no-continue": "off",
    "no-console": "off",
    "class-methods-use-this": "off",
    "import/no-unresolved": "off",
    "import/extensions": ["warn", "never"],
    "@typescript-eslint/no-var-requires": "off",
  },
};
