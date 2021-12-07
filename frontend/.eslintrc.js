module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', 'plugin:vue/recommended', '@vue/airbnb', 'prettier'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/html-closing-bracket-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/html-self-closing': 'off',
        'vue/no-v-html': 'off',
        'vue/require-default-prop': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-useless-template-attributes': 'off',
        'vue/no-lone-template': 'off',
        'vue/order-in-components': 'off',
        'no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'all',
                ignoreRestSiblings: false,
                varsIgnorePattern: '[iI]gnored', // do not report var containing 'ignored'
            },
        ],
        'import/no-named-default': 'off',
        'import/extensions': 'off',
        'function-paren-newline': 'off',
        'object-curly-newline': 'off',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
}
