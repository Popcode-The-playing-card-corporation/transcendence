import json
import tempfile
import os
from .models import PlayerPresence, Room
from django.utils import timezone
from pathlib import Path
from api.models import User
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):

	async def room_event(self, event):
		await self.send(text_data=json.dumps({
			"type": "event",
			"event": event["event"],
			"payload": event.get("payload", {}),
		}))

	async def chat_message(self, event):
		await self.send(text_data=json.dumps({
			"type": "chat_message",
			"payload": {
			"user": event["user"],
			"message": event["message"],
			"time": event["time"]
			}
		}))

	def getFile(self):
		tmp_dir = Path(tempfile.gettempdir())

		file_name = f"chat_{self.code}.tmp"
		file = tmp_dir / file_name

		return file

	async def connect(self):
		self.code = self.scope["url_route"]["kwargs"]["code"]
		self.group_name = f"chat_{self.code}"
		self.user = self.scope["user"]

		if not self.user.is_authenticated:
			await self.close()
			return
		
		room = await sync_to_async(Room.objects.get)(code=self.code)
		is_member = await sync_to_async(
			PlayerPresence.objects.filter(
				player=self.user,
				room=room
			).exists
		)()
		if (not is_member):
			await self.close()
			return

		await self.accept()

		await self.channel_layer.group_add(
			self.group_name,
			self.channel_name
		)

		await self.channel_layer.group_send(
			self.group_name,
			{
				"type": "room_event",
				"event": "user_joined",
				"payload": {
					"user": self.user.get_username(),
				}
			}
		)

		content = []
		file = self.getFile()
		if file.exists():
			for line in file.read_text().splitlines():
				content.append(json.loads(line))

		await self.send(text_data=json.dumps({"type": "history", "payload": content}))

	async def disconnect(self, close_code):
		if await sync_to_async(Room.objects.filter(code=self.code).exists)():
			
			room = await sync_to_async(Room.objects.get)(code=self.code)
	
			if (room.status == "end"):
				file = self.getFile()
				if (file.exists()):
					os.remove(file)
		else:
			file = self.getFile()
			if (file.exists()):
				os.remove(file)
		
		await self.channel_layer.group_discard(
			self.group_name,
			self.channel_name
		)

	async def receive(self, text_data):
		try:
			data = json.loads(text_data)
			if data.get("type") == "heartbeat":
				await self.send(text_data=json.dumps({
					"type": "acknowledge"
				}))
				return

			if (data.get("type") == "chat_message"):
				file = self.getFile()

				message = data.get("message")

				if (not message):
					await self.send(text_data=json.dumps({
						"type": "error",
						"message": "Message's empty"
					}))
					return

				if (type(message) != str):
					await self.send(text_data=json.dumps({
						"type": "error",
						"message": "Message's not a string"
					}))
					return

				user = await sync_to_async(User.objects.get)(id= self.user.id)

				user_data = {
					"id": user.id,
					"username": user.username,
					"avatar": user.avatar
				}

				time = timezone.now().strftime('%H:%M')

				event = {
					"type": "chat_message",
					"user": user_data,
					"message": message,
					"time": time
				}

				await self.channel_layer.group_send(self.group_name, event)

				data = str(event)
				with file.open("a") as f:
					f.write(json.dumps(event) + os.linesep)

			else:
				await self.send(text_data=json.dumps({
					"type": "error",
					"message": "Unknown action"
				}))

		except json.JSONDecodeError:
			await self.send(text_data=json.dumps({
				"type": "error",
				"message": "Invalid JSON"
			}))