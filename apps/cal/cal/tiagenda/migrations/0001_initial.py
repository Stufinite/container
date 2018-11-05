# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='USER',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(max_length=20)),
                ('school_email', models.CharField(max_length=20)),
                ('grade', models.CharField(max_length=20)),
                ('passward', models.CharField(max_length=20)),
                ('user_email', models.CharField(max_length=20)),
            ],
        ),
    ]
