import json

from redis_client import client
from channels.layers import get_channel_layer


async def listen_redis():

    print("REDIS LISTENER STARTED")

    pubsub = client.pubsub()

    await pubsub.psubscribe("room_events:*")

    channel_layer = get_channel_layer()

    print("SUBSCRIBED")

    async for message in pubsub.listen():

        if message["type"] != "pmessage":
            continue

        data = json.loads(message["data"])

        room_id = message["channel"].split(":")[1]

        print("RECEIVED:", data)

        if "player" in data:

            await channel_layer.group_send(
                f"player_{data['player']}",
                {
                    "type": data["type"],
                    "event": data["event"],
                    "payload": data.get("payload"),
                },
            )

        else:

            await channel_layer.group_send(
                f"room_{room_id}",
                {
                    "type": data["type"],
                    "event": data["event"],
                    "payload": data["payload"],
                },
            )