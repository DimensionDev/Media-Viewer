import Configuration from './webpack.base'
import merge from 'webpack-merge'
import HTMLInlineScriptPlugin from 'html-inline-script-webpack-plugin'

export default merge(Configuration, {
  mode: 'production',
  plugins: [new HTMLInlineScriptPlugin()],
})
