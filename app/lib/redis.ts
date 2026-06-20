import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

function addRedisData(data: unknown, key: string, ttlSeconds: number = 3600): void {
  const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data)
  const keyName = 'Chari-T:' + key
  redis.set(keyName, stringifiedData, { ex: ttlSeconds })
  console.log("Cache set")
}

function getRedisData(key: string): Promise<unknown> {
  const keyName = 'Chari-T:' + key
  console.log("Cache hit")
  return (redis.get(keyName))
}

function deleteRedisData(key: string): void {
  const keyName = 'Chari-T:' + key
  redis.del(keyName)
}

export { addRedisData, getRedisData, deleteRedisData }