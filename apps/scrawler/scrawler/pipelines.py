# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

from scrapy_djangoitem import DjangoItem
from scrawler.items import ScrawlerItem
# import my class
from scrawler.classModule.BuildCurso import BuildCurso
from scrawler.classModule.Buildcphelper import import2Mongo

class ScrawlerPipeline(object):
	def __init__(self):
		self.item = 0
		self.AllJson = []

	def process_item(self, item, spider):
		ScrawlerItem.django_model.objects.bulk_create(item['array'])

		self.item += 1
		self.AllJson += item['json']
		i = import2Mongo()
		i.save2DB(self.AllJson)

		sob = BuildCurso(school='NCHU')
		sob.BuildIndex()
