module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-recommended', '@vue/airbnb', 'prettier', 'plugin:cypress/recommended'],
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
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
      },
    },
  },
};
