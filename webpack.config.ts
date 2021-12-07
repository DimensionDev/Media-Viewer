import type { Configuration } from 'webpack'
import HTMLPlugin from 'html-webpack-plugin'
import HTMLInlineScriptPlugin from 'html-inline-script-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

const configurate: Configuration = {
  context: __dirname,
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  devtool: false,
  entry: [
    require.resolve('iframe-resizer/js/iframeResizer.contentWindow.min.js'),
    require.resolve('@google/model-viewer/dist/model-viewer.min.js'),
    require.resolve('./src'),
  ],
  module: {
    rules: [{ test: /\.ts$/, loader: require.resolve('ts-loader') }],
  },
  devServer: {
    server: { type: 'https' },
    bonjour: false,
    compress: true,
    hot: false,
    liveReload: false,
    webSocketServer: false,
  },
  plugins: [
    new HTMLPlugin({ inject: 'body', template: require.resolve('./template.ejs'), scriptLoading: 'blocking' }),
    new CopyPlugin({ patterns: [require.resolve('./debug.html')] }),
    new HTMLInlineScriptPlugin(),
  ],
}

export default configurate
