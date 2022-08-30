module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'plugin:vue/recommended', '@vue/airbnb', 'prettier'],
  rules: {
    'no-console': import.meta.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': import.meta.env.NODE_ENV === 'production' ? 'error' : 'warn',
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
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
