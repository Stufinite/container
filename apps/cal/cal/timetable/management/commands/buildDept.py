from django.core.management.base import BaseCommand, CommandError
from timetable.models import Department
from cal import settings
import json

class Command(BaseCommand):
    help = 'use this for activating buildDept'
    
    def add_arguments(self, parser):
            # Positional arguments
            parser.add_argument('school', type=str)

    def handle(self, *args, **options):
        school = options['school']
        Department.objects.all().delete()

        deptList = []
        with open(settings.STATICFILES_DIRS[0] + '/timetable/json/{}/Department.json'.format(school), 'r', encoding='utf-8') as f:
            data = json.load(f)

            for dept_by_degree in data:
                for dept in dept_by_degree["department"]:
                    # print(dept_by_degree["degree"], dept["zh_TW"], dept["en_US"], dept["value"])
                    deptList.append(
                        Department(
                            school=school,
                            degree=dept_by_degree["degree"],
                            code=dept["value"],
                            title="{},{}".format(dept["zh_TW"], dept["en_US"])
                        )
                    )

        Department.objects.bulk_create(deptList)
        self.stdout.write(self.style.SUCCESS('build Dept success!!!'))