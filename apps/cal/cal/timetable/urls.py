from django.conf.urls import url

from .views import views, apis, user_apis

urlpatterns = [
    url(r'^$', views.timetable),
]

urlpatterns += [
    url(r'^api/get/course/code/(?P<course_code>\d+)$', apis.get_course_by_code),
    url(r'^api/get/course/code$', apis.get_courses_by_code),

    url(r'^api/get/dept$', apis.get_department),

    url(r'^api/get/selected_course$', apis.get_friend_selected_course),
    url(r'^api/store/selected_course$', apis.store_selected_course),

    url(r'^api/user/edit$', user_apis.user_edit),
]
