from django.http import JsonResponse, Http404
from django.shortcuts import render
from infernoWeb.models import User
from functools import wraps
from inferno.settings import USERPOOL_URL as USERPOOL_URL
import requests

def user_verify(function):
    @wraps(function)
    def wrap(request, *args, **kwargs):
        try:
            r = requests.get(
                USERPOOL_URL + '/fb/user/verify/{}/{}'.format(request.POST['id'], request.POST['verify']))
            if r.text == 'Ok':
                return function(request, *args, **kwargs)
        except Exception as e:
            print(e)
        print("you need to login!!")
        raise Http404("you need to login!!")
    return wrap

def createUser(request):
    if request.POST['id']:
        User.objects.update_or_create(facebookid=request.POST['id'],defaults={
            'name':request.POST['name'],
            'major':request.POST.get('profile[major]', ''),
            'career':request.POST.get('profile[career]', ''),
            'grade':request.POST.get('profile[grade]', ''),
            'school':request.POST.get('profile[school]', '')
        })
        return JsonResponse({"createUser":'success'})
    return JsonResponse({"createUser":'"createUser error"'})
    
def index(request):
    return render(request, 'infernoWeb/redirect.html', locals())