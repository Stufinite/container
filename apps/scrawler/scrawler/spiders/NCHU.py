# -*- coding: utf-8 -*-
import json

import scrapy
from scrawler.items import ScrawlerItem
from timetable.models import Course


class NchuSpider(scrapy.Spider):
	name = "NCHU"
	allowed_domains = ["onepiece.nchu.edu.tw/cofsys/plsql/json_for_course?p_career="]
	start_urls = [
		'https://onepiece.nchu.edu.tw/cofsys/plsql/json_for_course?p_career=U',
		'https://onepiece.nchu.edu.tw/cofsys/plsql/json_for_course?p_career=G',
		'https://onepiece.nchu.edu.tw/cofsys/plsql/json_for_course?p_career=O'
	]

	def __init__(self, semester):
		Course.objects.all().delete()
		self.CodeSet = set()
		self.school='NCHU'
		self.semester = semester

	def parse(self, response):
		def validateTmpJson(tmpFile):
			def truncateNewLineSpace(line):
				tmp = ""
				for i in line:
					if i != "\n" and i != " ":
						tmp+=i
				return tmp
			# truncate invalid char to turn it into json
			jsonStr = ""
			for line in tmpFile:
				tmp = truncateNewLineSpace(line)
				jsonStr +=tmp
			return jsonStr

		try:
			data = json.loads(response.text)
		except Exception as e:
			try:
				data = json.loads(validateTmpJson(response.text))
			except Exception as e:
				print(e)
				raise e
		json.dump(data, open('{}.json'.format(response.url.split('?p_career=')[-1]), 'w'))
		CourseList = []

		for c in data["course"]:
			try:

				time = ''
				for i in c['time_parsed']:
					time += str(i['day']) + '-'
					for j in i['time']:
						time += str(j) + '-'
					time = time[:-1]
					time += ','

				if c['code'] not in self.CodeSet:
					self.CodeSet.add(c['code'])

					CourseList.append( 
						Course(
							**ScrawlerItem(
								school=self.school.upper(),
								semester=str(self.semester),
								code=c['code'],
								credits=c['credits'],
								title='{},{}'.format(
									c['title_parsed']['zh_TW'],
									c['title_parsed']['en_US']
								),
								department=c['department'],
								professor=c['professor'],
								time=time[:-1],
								intern_location=c['intern_location'][0],
								location=c['location'][0],
								obligatory=c['obligatory_tf'],
								language=c['language'],
								prerequisite=c['prerequisite'],
								note=c['note'],
								discipline=c['discipline']
							)
						)
					)
			except Exception as e:
				print(e)
				raise e

		return {'array':CourseList, 'json':data["course"]}
