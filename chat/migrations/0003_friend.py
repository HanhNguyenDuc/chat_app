# Generated by Django 3.0.2 on 2020-02-05 03:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_auto_20200203_0208'),
    ]

    operations = [
        migrations.CreateModel(
            name='Friend',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('friend_1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend_1', to=settings.AUTH_USER_MODEL)),
                ('friend_2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend_2', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
