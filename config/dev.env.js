var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PUSHER_SESSION_CHANNEL: '"sessionsTest"',
  PUSHER_QUEUE_CHANNEL: '"queuesTest"',
  PUSHER_ON_SESSION: '"onSessionTest"',
  PUSHER_ON_SESSION_REMOVE: '"onSessionRemoveTest"',
  PUSHER_ON_QUEUE_REMOVED: '"onQueueRemovedTest"',
  PUSHER_ON_NEW_QUEUE: '"onNewQueueTest"',
})
