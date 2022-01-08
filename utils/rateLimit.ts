import LRU from 'lru-cache'
import { NextApiResponse } from 'next';

const rateLimiter = (options = { uniqueTokenPerInterval: 500, interval: 60000 }) => {
  const tokenCache = new LRU({
    max: options.uniqueTokenPerInterval,
    maxAge: options.interval,
  })

  return {
    check: (res: NextApiResponse, limit: number, token: string) => {
      if (!token) return false;

      const tokenCount = tokenCache.get(token) || [0]
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount)
      }
      tokenCount[0] += 1

      const currentUsage = tokenCount[0]
      const isRateLimited = currentUsage >= limit
      res.setHeader('X-RateLimit-Limit', limit)
      res.setHeader(
        'X-RateLimit-Remaining',
        isRateLimited ? 0 : limit - currentUsage
      )

      return isRateLimited
    }
      
  }
}

export default rateLimiter