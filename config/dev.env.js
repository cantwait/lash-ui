var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PUSHER_KEY:'"5795fd77db4198bd9713"',
  PUSHER_CLUSTER:'"us2"'
})
