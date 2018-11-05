from django.conf.urls import include, url
from django.contrib import admin
from django.conf.urls import url
from tiagenda import views

urlpatterns = [
  url(r'^$', views.tiagenda, name='index'),#這樣做似乎是對應到,首頁
]