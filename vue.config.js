const { defineConfig } = require('@vue/cli-service')
const sass = require('sass')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // Deshabilitar ESLint completamente
  lintOnSave: false,
  
  // Configuración del devServer con HMR deshabilitado
  devServer: {
    hot: false,  // ← Deshabilitar hot reload
    liveReload: false,  // ← Deshabilitar live reload
    client: {
      overlay: {
        warnings: false,
        errors: true
      },
      webSocketTransport: 'ws'  // Forzar protocolo ws
    },
    webSocketServer: false  // ← Deshabilitar WebSocket server
  },
  
  // SOLUCIÓN PARA EL ERROR forkTsCheckerServiceBeforeStart
  chainWebpack: (config) => {
    // Deshabilitar fork-ts-checker para desarrollo
    if (process.env.NODE_ENV === 'development') {
      config.plugins.delete('fork-ts-checker')
    }
    
    // Deshabilitar otras optimizaciones que puedan causar conflicto
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  },
  
  // Configuración adicional
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      symlinks: false
    }
  },
  
  // Deshabilitar paralelización
  parallel: false,
  
  // Configuración para Sass con API moderna
  css: {
    loaderOptions: {
      sass: {
        implementation: sass,
        sassOptions: {
          api: 'modern',  // ← Forzar API moderna de Sass
          quietDeps: true,  // ← Suprimir warnings de dependencias
          silenceDeprecations: ['legacy-js-api']  // ← Silenciar warnings específicos de API legada
        }
      },
      scss: {
        implementation: sass,
        sassOptions: {
          api: 'modern',
          quietDeps: true,
          silenceDeprecations: ['legacy-js-api']
        }
      }
    } 
  }
})