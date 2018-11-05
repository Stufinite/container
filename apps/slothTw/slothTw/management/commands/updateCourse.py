from django.core.management.base import BaseCommand, CommandError
from slothTw.models import Course
import json

class Command(BaseCommand):
    help = 'Convenient Way to insert Course json into inferno'
    def add_arguments(self, parser):
            # Positional arguments
            parser.add_argument('json', type=str)

    def handle(self, *args, **options):
        file = options['json']
        with open(file, 'r') as f:
            for i in json.load(f)['course']:
                if i['department'] == '通識教育中心':
                    # 通識課程都叫O.json
                    try:
                        ctype = '通識'
                        self.createCourse(i, ctype)
                    except Exception as e:
                        print(i)
                        raise e
                elif i['for_dept'] == '全校共同':
                    try:
                        ctype = '其他'
                        self.createCourse(i, ctype)
                    except Exception as e:
                        print(i)
                        raise e
                else:
                    try:
                        ctype = '必修' if i['obligatory_tf'] else '選修'
                        self.createCourse(i, ctype)
                    except Exception as e:
                        print(i)
                        raise e
        self.stdout.write(self.style.SUCCESS('insert Json success!!!'))

    @staticmethod
    def createCourse(i, ctype):
        obj, created = Course.objects.get_or_create(
            name=i['title_parsed']['zh_TW'],
            dept=i['department'],
            teacher=i['professor'],
            defaults={
                'ctype':ctype,
                'avatar':'blackboard.png',
                'school':'nchu',
                'book':'教科書配ppt'
            }
        )
        if created:
            print(obj, obj.dept, obj.teacher, obj.ctype)