# -*- coding: utf-8 -*-
from django.conf.urls import url
from slothTw import views

urlpatterns = [
  url(r'^get/clist$', views.clist, name='clist'),
  url(r'^get/cvalue$', views.cvalue, name='cvalue'),
  url(r'^get/search$', views.search, name='search'),
  url(r'^get/comment$', views.comment, name='comment'),
  url(r'^get/like$', views.like, name='like'),
  url(r'^get/questionnaire$', views.questionnaire, name='questionnaire'),
]