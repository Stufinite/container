# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tiagenda', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='verification',
            field=models.CharField(max_length=5, default=''),
        ),
    ]
