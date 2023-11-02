module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/teste/'
  : '/',
  transpileDependencies: [
    'vuetify'
  ]
}
