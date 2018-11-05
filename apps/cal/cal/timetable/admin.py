from django.contrib import admin

from timetable.models import Department, Course, SelectedCourse

admin.site.register(Department)
admin.site.register(Course)
admin.site.register(SelectedCourse)
