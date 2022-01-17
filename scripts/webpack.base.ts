import CopyPlugin from 'copy-webpack-plugin'
import HTMLPlugin from 'html-webpack-plugin'
import path from 'path'
import type { Configuration } from 'webpack'

const context = path.resolve(__dirname, '..')

const configurate: Configuration = {
  context,
  resolve: { extensions: ['.ts', '.js', '.json'] },
  entry: [
    require.resolve('iframe-resizer/js/iframeResizer.contentWindow.min.js'),
    require.resolve('@google/model-viewer/dist/model-viewer.min.js'),
    path.resolve(context, 'src'),
  ],
  module: {
    rules: [{ test: /\.ts$/, loader: require.resolve('ts-loader') }, {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    },]
  },
  plugins: [
    new HTMLPlugin({ inject: 'body', template: require.resolve('./template.ejs'), scriptLoading: 'blocking' }),
    new CopyPlugin({ patterns: [require.resolve('./debug.html')] }),
  ],
}

export default configurate
