const Bull = require('bull');
const videoQueue = new Bull('video-generation', {
  redis: { host: process.env.REDIS_HOST, port: 6379 }
});
module.exports = videoQueue;
