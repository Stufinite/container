from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def timetable(request):
    return render(request, 'index.html', {})
