from django.db import models

# Create your models here.
class USER(models.Model):
	name=models.CharField(max_length=20)
	school_email=models.CharField(max_length=20)
	grade=models.CharField(max_length=20)
	passward=models.CharField(max_length=20)
	user_email=models.CharField(max_length=20)
	verification=models.CharField(max_length=5,default='')
	is_verify=models.BooleanField(default=False)
	
	def __str__(self):
		return self.name