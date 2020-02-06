from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.

class Member(AbstractUser):
    gen = models.IntegerField(name="gen", default=17)
    
class Friend(models.Model):
    friend_1 = models.ForeignKey(Member, related_name="friend_1", on_delete = models.CASCADE)
    friend_2 = models.ForeignKey(Member, related_name="friend_2", on_delete = models.CASCADE)
    # sent_message_num = 0

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    status = models.BooleanField(default=False)

    def __str__(self):
        return f"Profile of {self.user.username}"