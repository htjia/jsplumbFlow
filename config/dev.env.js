'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.2.66:8080"',
  // BASE_API: '"http://192.168.122.42:90/webviewserver"',
  DOWNLOAD_API: '"http://172.28.0.229:8080/mysqldataservice"'
})
