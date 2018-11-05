from django.test import TestCase
from django.test import Client
from django.core.urlresolvers import reverse

# Create your tests here.
class SlothTestCase(TestCase):
	fixtures = ['sloth.json']
	def setUp(self):
		self.client = Client()

	def test_clist(self):
		response = self.client.get(reverse('sloth:clist')+"?school=nchu&start=1")
		self.assertEqual(response.json(), [{'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '莊敬堯', 'name': '生物化學與人生'}, 'model': 'slothTw.course', 'pk': 3}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '范耀中', 'name': '演算法'}, 'model': 'slothTw.course', 'pk': 4}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '李建福', 'name': '對聯欣賞及創作'}, 'model': 'slothTw.course', 'pk': 5}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '周玟觀', 'name': '繪本文學欣賞'}, 'model': 'slothTw.course', 'pk': 6}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '林淑貞', 'name': '繪本文學欣賞'}, 'model': 'slothTw.course', 'pk': 7}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '蔡淑惠', 'name': '西方電影文學'}, 'model': 'slothTw.course', 'pk': 8}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '黃東陽', 'name': '中國古典短篇小說選讀'}, 'model': 'slothTw.course', 'pk': 9}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '蔡妙真', 'name': '中國古典短篇小說選讀'}, 'model': 'slothTw.course', 'pk': 10}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '尤雅姿', 'name': '魏晉南北朝志怪小說'}, 'model': 'slothTw.course', 'pk': 11}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '羅秀美', 'name': '飲食文學'}, 'model': 'slothTw.course', 'pk': 12}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '宋維科', 'name': '西洋文學概論'}, 'model': 'slothTw.course', 'pk': 13}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '尤雅姿', 'name': '文學探索'}, 'model': 'slothTw.course', 'pk': 14}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '陳碩文', 'name': '華語影視文學'}, 'model': 'slothTw.course', 'pk': 15}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '邱貴芬', 'name': '臺灣現當代作家與作品'}, 'model': 'slothTw.course', 'pk': 16}, {'fields': {'avatar': 'course_4zW59VQ.png', 'teacher': '陳碩文', 'name': '臺灣現當代作家與作品'}, 'model': 'slothTw.course', 'pk': 17}])

	def test_cvalue(self):
		response = self.client.get(reverse('sloth:cvalue')+'?id=4')
		self.assertEqual(response.json(), {'id': 4, 'avatar': '/media/course_4zW59VQ.png', 'feedback_knowledgeable': 2.9, 'feedback_FU': 2.4, 'teacher': '范耀中', 'feedback_easy': 1.95, 'feedback_amount': 5, 'syllabus': '暫不提供', 'feedback_freedom': 3.05, 'name': '演算法', 'feedback_GPA': 2.8, 'ctype': '必修', 'school': 'nchu', 'book': '教科書配ppt'})

	def test_search(self):
		response = self.client.get(reverse('sloth:search')+"?school=nchu&teacher=范耀中&name=演算法")
		self.assertEqual(response.json(), [{'id': 4, 'avatar': '/media/course_4zW59VQ.png', 'feedback_knowledgeable': 2.9, 'feedback_FU': 2.4, 'teacher': '范耀中', 'feedback_easy': 1.95, 'feedback_amount': 5, 'syllabus': '暫不提供', 'feedback_freedom': 3.05, 'name': '演算法', 'feedback_GPA': 2.8, 'ctype': '必修', 'school': 'nchu', 'book': '教科書配ppt'}]
)

	def test_comment(self):
		response = self.client.get(reverse('sloth:comment')+"?id=4&start=1")
		self.assertEqual(response.json(), [{'fields': {'raw': '好課不修嗎XD', 'create': '2017-04-19T05:47:54.696Z', 'course': 4}, 'model': 'slothTw.comment', 'pk': 47}, {'fields': {'raw': '資工***必修***課程', 'create': '2017-04-19T05:47:54.696Z', 'course': 4}, 'model': 'slothTw.comment', 'pk': 48}, {'fields': {'raw': 'ya', 'create': '2017-04-19T05:47:54.696Z', 'course': 4}, 'model': 'slothTw.comment', 'pk': 49}])