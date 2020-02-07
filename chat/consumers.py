# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncJsonWebsocketConsumer
import json
from django.template.loader import render_to_string
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync, sync_to_async
from .models import Member, Profile, Friend

class OnlineConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add("users", self.channel_name)

        user = self.scope['user']
        if user.is_authenticated:
            await self.update_user_status(user, True)
            await self.send_status(user)

    async def disconnect(self, code):
        await self.channel_layer.group_discard("users", self.channel_name)

        user = self.scope['user']
        if user.is_authenticated:
            await self.update_user_status(user, False)
            await self.send_status(user)

    def get_friend_of_member(self, friends):
        # user_status = []
        # print(friends)
        list_user = Member.objects.all()
        for user in list_user:
            profile = Profile.objects.get(user=user)
            self.user_status.append([user.username, profile.status])
        # return json.dumps(user_status)

    async def send_status(self, user=None):
        friends = Friend.objects.filter(friend_1=user)
        self.user_status = []

        await sync_to_async(self.get_friend_of_member)(friends)

        await self.channel_layer.group_send(
            'users',
            {
                'type': 'user_update',
                'event': 'Change Status',
                'html_user': self.user_status,
            }
        )

    async def user_update(self, event):
        await self.send_json(event)
        print('user_update', event)

    @database_sync_to_async
    def update_user_status(self, user, status):
        return Profile.objects.filter(user_id=user.pk).update(status=status)
    



class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        user = text_data_json['user']
        date = text_data_json['date']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user': user,
                'date': date,
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        user = event['user']
        date = event['date']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'user': user,
            'date': date,
        }))
