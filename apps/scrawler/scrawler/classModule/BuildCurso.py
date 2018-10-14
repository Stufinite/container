import re, jieba, pyprind, pymongo
from timetable.models import Course
from pymongo import MongoClient
class BuildCurso(object):
	"""docstring for ClassName"""
	def __init__(self, school=None, uri=None):
		self.client = MongoClient(uri)
		self.db = self.client['timetable']
		self.SrchCollect = self.db['CourseSearch']
		self.school = school
		
	def BuildIndex(self):
		def bigram(title):
			bigram = (title.split(',')[0], title.split(',')[1].replace('.', ''))
			title = re.sub(r'\(.*\)', '', title.split(',')[0]).split()[0].strip()
			bigram += (title, )
			if len(title) > 2:
				prefix = title[0]
				for i in range(1, len(title)):
					if title[i:].count(title[i]) == 1:
						bigram += (prefix + title[i],)
			return bigram

		tmp = dict()
		for i in pyprind.prog_percent(Course.objects.all()):
			key = bigram(i.title)
			titleTerms = self.title2terms(i.title)
			CourseCode = i.code

			for k in key:
				tmp.setdefault(k, set()).add(CourseCode)
			for t in titleTerms:
				tmp.setdefault(t, set()).add(CourseCode)
			tmp.setdefault(i.professor, set()).add(CourseCode)
			tmp.setdefault(CourseCode, set()).add(CourseCode)

		result = tuple( {'key':key, self.school:list(value)} for key, value in tmp.items() if key != '' and key!=None)

		self.SrchCollect.remove({})
		
		self.SrchCollect.insert(result)
		self.SrchCollect.create_index([("key", pymongo.HASHED)])

	def title2terms(self, title):
		terms = jieba.cut(title)
		return tuple(i for i in terms if len(i)>=2)