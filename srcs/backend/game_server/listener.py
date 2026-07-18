import json
from .redis import client


async def listen_room(room_id, manager):

    pubsub = client.pubsub()

    await pubsub.subscribe(
        "game_actions"
    )

    async for message in pubsub.listen():
    
        if message["type"] != "message":
            continue
    
        raw = message["data"]
    
        if not isinstance(raw, (str, bytes, bytearray)):
            print("Message Redis invalide:", raw)
            continue
        print(raw)
        data = json.loads(raw)
        
        await manager.handle_action(
            data["room"],
            data
        )
        