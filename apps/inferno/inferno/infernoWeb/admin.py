from django.contrib import admin
from infernoWeb.models import User
# Register your models here.
class UserAdmin(admin.ModelAdmin):
    search_fields = ('facebookid', 'major')

admin.site.register(User, UserAdmin)