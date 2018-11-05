from django.db import models

class UserManager(models.Manager):
    def get_by_natural_key(self, name, facebookid):
        return self.get(name=name, facebookid=facebookid)


# Create your models here.
class User(models.Model):
    objects = UserManager()

    facebookid = models.CharField(max_length=255)
    name = models.CharField(max_length=7)
    career = models.CharField(max_length=1)
    grade = models.CharField(max_length=3)
    major = models.CharField(max_length=30)
    school = models.CharField(max_length=10)
    def natural_key(self):
        return (self.name, self.facebookid)

    def __str__(self):
        return self.name + '-' + self.major

    class Meta:
        unique_together = (('name', 'facebookid'),)