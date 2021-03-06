module.exports = {
  configureWebpack: {
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
      }
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "Piping VNC Server for Windows";
        return args;
      })
  },
  transpileDependencies: [
    'vuetify'
  ]
}
