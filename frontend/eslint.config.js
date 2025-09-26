
import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

import vue from 'eslint-plugin-vue';
import vueA11y from 'eslint-plugin-vuejs-accessibility';
import importPlugin from 'eslint-plugin-import';

import babelParser from "@babel/eslint-parser";
import vueParser from 'vue-eslint-parser';
import prettier from 'eslint-config-prettier';


import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default defineConfig([
    vue.configs['flat/recommended'],
    ...compat.extends("@vue/airbnb"),
    {
        files: ['**/*.js'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    presets: ['@babel/preset-env'],
                },
            },
        },
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser, // Vue SFC parser
            parserOptions: {
                parser: {
                    js: babelParser, // use babel for <script>
                },
                requireConfigFile: false,
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
    },
    {
        plugins: {
            vue: vue,
            'vuejs-accessibility': vueA11y,
            import: importPlugin,
        },
        rules: {
            'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
            'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
            'vue/multiline-html-element-content-newline': 'off',
            'vue/no-v-html': 'off',
            'vue/require-default-prop': 'off',
            'vue/multi-word-component-names': 'off',
            'vue/no-useless-template-attributes': 'off',
            'vue/no-lone-template': 'off',
            'vue/order-in-components': 'off',
            'vue/v-slot-style': 'off',
            'import/no-named-default': 'off',
            'import/extensions': 'off',
            'vuejs-accessibility/alt-text': 'off',
            'vuejs-accessibility/anchor-has-content': 'off',
            'vuejs-accessibility/click-events-have-key-events': 'off',
            'vuejs-accessibility/form-control-has-label': 'off',
            'vuejs-accessibility/interactive-supports-focus': 'off',
            'vuejs-accessibility/label-has-for': 'off',
            'vuejs-accessibility/mouse-events-have-key-events': 'off',
            'vue/no-reserved-component-names': 'off',
            'vue/no-v-text-v-html-on-component': 'off',
            'vue/dot-notation': 'off',
            'vue/prefer-template': 'off'
        },
        settings: {
            'import/resolver': {
                alias: {
                    map: [
                        ['@', path.resolve(__dirname, './src')],
                    ],
                    extensions: ['.js', '.vue', '.json'],
                },
            },
        },
    },
    prettier,
]);
