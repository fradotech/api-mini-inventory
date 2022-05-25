const redis = require('redis')
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD
})

client.on('connect', () => {
  console.log('connected to redis successfully!')
})

client.on('error', (error) => {
  console.log('Redis connection error :', error)
})

module.exports = client