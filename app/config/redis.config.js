const redis = require('ioredis')
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD
})

client.on('error', (error) => {
  console.log('Redis connection error :', error)
})

client.on('connect', () => {
  console.log('connected to redis successfully!')
})

const redisConnet = async () => {
  await client.auth(process.env.REDIS_PASSWORD)
  .catch(err => { console.log('Redis auth error: ' + err.message) });
}

redisConnet()

module.exports = client