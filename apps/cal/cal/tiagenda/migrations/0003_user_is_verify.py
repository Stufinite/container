# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tiagenda', '0002_user_verification'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_verify',
            field=models.BooleanField(default=False),
        ),
    ]
