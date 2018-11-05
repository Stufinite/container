from django.http import JsonResponse, HttpResponseRedirect, Http404, HttpResponse

from timetable.models import Department, Course, SelectedCourse


def get_friend_selected_course(request):
    user_id = request.POST.get('id')
    semester = request.POST.get('semester')
    return JsonResponse(get_selected_course(user_id, semester), safe=False)


def get_selected_course(user_id, semester):
    try:
        result = list(map(
            lambda c: c.code,
            SelectedCourse.objects.filter(user_id=user_id, semester=semester)
        ))
        return result
    except:
        raise Http404("Page does not exist")


def get_department(request):
    try:
        result = {}
        for d in Department.objects.all().order_by('code'):
            try:
                result[d.degree].append({
                    'code': d.code,
                    'title': {
                        'zh_TW': d.title.split(',')[0],
                        'en_US': d.title.split(',')[1],
                    },
                })
            except KeyError:
                result[d.degree] = []
                result[d.degree].append({
                    'code': d.code,
                    'title': {
                        'zh_TW': d.title.split(',')[0],
                        'en_US': d.title.split(',')[1],
                    },
                })

        return JsonResponse(result, safe=False)
    except:
        raise Http404("Page does not exist")

def get_courses_by_code(request):
    semester = request.GET.get('semester')
    codes_str = request.GET.get('code')
    codes = codes_str.split(' ')
    result = []
    try:
        for code in codes:
            c = Course.objects.get(code=code, semester=semester)
            result.append({
                    "code": c.code,
                    "credits": c.credits,
                    "title": {
                        "zh_TW": c.title.split(",")[0],
                        "en_US": c.title.split(",")[1],
                    },
                    "professor": c.professor,
                    "department": c.department,
                    "time": c.time,
                    "location": c.location,
                    "intern_location": c.intern_location,
                    "prerequisite": c.prerequisite,
                    "note": c.note,
                    "discipline": c.discipline,
                }
            )
        return JsonResponse(result, safe=False)
    except Exception as e:
        raise Http404("Page does not exist")
    return HttpResponse(str(codes))


def get_course_by_code(request, course_code):
    try:
        result = list(map(
            lambda c: {
                "code": c.code,
                "credits": c.credits,
                "title": {
                    "zh_TW": c.title.split(",")[0],
                    "en_US": c.title.split(",")[1],
                },
                "professor": c.professor,
                "department": c.department,
                "time": c.time,
                "location": c.location,
                "intern_location": c.intern_location,
                "prerequisite": c.prerequisite,
                "note": c.note,
                "discipline": c.discipline,
            },
            Course.objects.filter(code=course_code)
        ))

        return JsonResponse(result, safe=False)
    except:
        raise Http404("Page does not exist")


def store_selected_course(request):
    if request.method == 'POST':
        user_id = request.POST.get('id')
        if user_id == '':
            raise Http404("Page does not exist")
        selected = request.POST.get('selected').split(',')
        semester = request.POST.get('semester')
        try:
            SelectedCourse.objects.filter(user_id=user_id, semester=semester).delete()
            for code in selected:
                if not code.isdigit():
                    raise Http404("Page does not exist")
                sc, created = SelectedCourse.objects.get_or_create(
                    code=code, user_id=user_id, semester=semester)
                if not created:
                    sc.save()
        except:
            raise Http404("Page does not exist")
        return JsonResponse({"state": "ok"})
    else:
        raise Http404("Page does not exist")
