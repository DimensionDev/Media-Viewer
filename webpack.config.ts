import Development from './scripts/webpack.development'
import Production from './scripts/webpack.production'

export default (env: Record<string, string>, argv: Record<string, string>) => {
  if (argv.mode === 'production') {
    return Production
  }
  return Development
}
