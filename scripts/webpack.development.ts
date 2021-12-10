import Configuration from './webpack.base'
import merge from 'webpack-merge'

export default merge(Configuration, {
  mode: 'development',
  devtool: false,
  devServer: {
    server: { type: 'https' },
    compress: true,
    hot: false,
    liveReload: false,
    webSocketServer: false,
  },
})
