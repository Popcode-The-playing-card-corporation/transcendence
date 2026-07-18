import redis.asyncio as redis

client = redis.Redis(
    host="redis",
    port=6379,
    db=2,
    decode_responses=True
)
