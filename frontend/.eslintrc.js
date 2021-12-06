module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    '@vue/airbnb',
    'prettier',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': ["error", {
      "singleline": 5,
      "multiline": {
        "max": 5,
        "allowFirstLine": true,
      }
    }],
    'vue/html-closing-bracket-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'no-unused-vars': ['error', {
      'vars': 'all',
      'args': 'all',
      'ignoreRestSiblings': false,
      'varsIgnorePattern': '[iI]gnored', // do not report var containing 'ignored'
    }],
    'import/no-named-default': 'off',
    'import/extensions': 'off',
    'max-len': ['error', {
      'code': 120,
      'ignoreUrls': true,
      'ignoreComments': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreRegExpLiterals': true,
    }],
    'function-paren-newline': 'off',
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never',
    }],
    'object-curly-newline': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
