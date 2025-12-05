// En la raíz del proyecto, crea: vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // SOLUCIÓN PARA EL ERROR forkTsCheckerServiceBeforeStart
  chainWebpack: (config) => {
    // Deshabilitar fork-ts-checker para desarrollo
    if (process.env.NODE_ENV === 'development') {
      config.plugins.delete('fork-ts-checker')
    }
  },
  
  // Configuración adicional
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      symlinks: false
    }
  },
  
  // Deshabilitar paralelización
  parallel: false
})