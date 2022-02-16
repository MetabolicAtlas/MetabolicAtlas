// vue.config.js
const IS_DEV = process.env.NODE_ENV === 'development'

// plugins for compressing the static files
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
    productionSourceMap: false,
    lintOnSave: 'default',
    css: {
        loaderOptions: {
            sass: {
                // @/ is an alias to src/  so this assumes you have a file named `src/vars.scss`
                additionalData: '@import "~@/style/vars.scss";',
            },
        },
    },
    pluginOptions: {
        webpackBundleAnalyzer: {
            analyzerMode: IS_DEV ? 'server' : 'disabled',
            // Using the same host name as the container name
            analyzerHost: 'frontend',
            analyzerPort: 81,
            openAnalyzer: false,
        },
    },
    configureWebpack: {
        plugins: [new CompressionPlugin()],
    },
}
