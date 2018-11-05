# -*- coding: utf-8 -*-
from django.shortcuts import render,redirect
from django.shortcuts import render_to_response
from django.core.mail import send_mail
from django.conf import settings
from tiagenda.models import USER
from django.template import RequestContext
from random import choice
import random,json
from tiagenda.models import USER
# from course.models import Course_of_user
from django.contrib.auth import authenticate, login # get data from frontend


def tiagenda(request):
	# range_td = range(1,14)
	# range_img=range(2,7)
	# num_of_person=0
	# agenda_count_add=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
	# init=0
	# if 'init' in request.session:
	# 	init=1
	# # 傳入redirect之前處理的資料
	# if 'search' in request.session:
	# 	if request.session['search']==1:
	# 		num_of_person=1
	# 		agenda_count_add=request.session['agenda_count_add']
	# 		file_name=request.session['file_name']
	# 		request.session['search']=0
	# if Course_of_user.objects.get(user_name=request.user.email) and 'init' not in request.session and 'search_name' not in request.POST:
	# 	user=Course_of_user.objects.get(user_name=request.user.email)
	# 	file_name=user.user_name;
	# 	current_name=file_name
	# 	for i in json.loads(user.time_table):
	# 		for j in i['time_parsed']:
	# 			for k in j['time']:
	# 				agenda_count_add[j['day']-1][k-1]=1
	# 	request.session['init']=1
	# elif 'search_name' in request.POST and Course_of_user.objects.get(user_name=request.POST['search_name'])  and request.POST['search_name']!='':
	# 	search_user=Course_of_user.objects.get(user_name=request.POST['search_name'])
	# 	file_name=search_user.user_name;
	# 	for i in json.loads(search_user.time_table):
	# 		for j in i['time_parsed']:
	# 			for k in j['time']:
	# 				agenda_count_add[j['day']-1][k-1]+=1
	# 	request.session['search']=1
	# 	request.session['agenda_count_add']=agenda_count_add
	# 	request.session['file_name']=file_name
	# 	return redirect('/tiagenda/') #避免使用者在重新整理時,會重新傳送表單
	# return render_to_response('tiagenda/index.html',locals(),context_instance=RequestContext(request))
	return render_to_response('tiagenda/index.html',locals())

