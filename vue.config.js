const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
// @see https://github.com/chrisvfritz/prerender-spa-plugin

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ?
      'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.energy-bulkuser.signup.mc-v2/':'./',
    /*
    configureWebpack: {
      resolve: {
        alias: {
          '/assets/': process.env.NODE_ENV === 'production' ? 'https://change.greenpeace.org.tw/2020/petition-test/zh-tw.2020.test/' : '/assets/'
        }
      }
    }*/

    outputDir: 'build',

    assetsDir: 'static',

    filenameHashing: true,

    configureWebpack:  {
      plugins: process.env.NODE_ENV === 'production' ? [
        new PrerenderSPAPlugin({
          // Required - The path to the webpack-outputted app to prerender.
          staticDir: path.join(__dirname, 'build'),
          // Required - Routes to render.
          routes: [ '/'],
        })
      ] : []
    },
    devServer: {
      disableHostCheck: true
    }
};