import globals from "globals";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import jestPlugin from "eslint-plugin-jest";

import { FlatCompat } from "@eslint/eslintrc";
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended, // base ESLint recommended
  ...compat.extends("airbnb-base"),

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
      globals: {
        ...globals.es6,
        ...globals.node,
        ...globals.jest,
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        API_BASE: "writable",
        HUMAN_GEM_VERSION: "writable",
        FRUITFLY_GEM_VERSION: "writable",
        MOUSE_GEM_VERSION: "writable",
        WORM_GEM_VERSION: "writable",
        RAT_GEM_VERSION: "writable",
        YEAST_GEM_VERSION: "writable",
        ZEBRAFISH_GEM_VERSION: "writable",
        COMPONENTS: "writable",
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      "no-plusplus": "off",
      "no-unused-vars": "off",
      "prefer-const": "off",
      "no-restricted-syntax": "off",
      "block-scoped-var": "off",
      camelcase: "off",
      "consistent-return": "off",
      eqeqeq: "off",
      "import/newline-after-import": "off",
      "import/no-unresolved": "off",
      "no-console": "off",
      "no-extra-boolean-cast": "off",
      "no-param-reassign": "off",
      "no-return-await": "off",
      "no-shadow": "off",
      "no-use-before-define": "off",
      "no-useless-escape": "off",
      "no-var": "off",
      "one-var": "off",
      radix: "off",
      "vars-on-top": "off",
      "no-underscore-dangle": "off",
      "dot-notation": "off",
      "import/prefer-default-export": "off",
      "global-require": "off",
      "prefer-arrow-callback": "off",
      "func-names": "off",

      "jest/expect-expect": [
        "error",
        { assertFunctionNames: ["expect", "validateComponent"] },
      ],
    },
  },
  prettier,
];
