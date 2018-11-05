import os

from .settings import BASE_DIR

DATABASE_SETTINGS = {
    'sqlite': {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    },
    'mysql': {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'cal',
            'USER': 'root',
            'PASSWORD': 'suckmydick87',
            'HOST': '127.0.0.1',
            'PORT': '3306',
        }
    }
}
