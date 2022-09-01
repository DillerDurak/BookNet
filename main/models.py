from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    image = models.ImageField(default='user-images/default-user.png', upload_to='user-images/', null=True, blank=True)
    email = models.EmailField(null=True, blank=True, unique=True)
    book = models.ManyToManyField('Book', related_name='user')


    @property
    def imageURL(self):
        try:
            url = self.image.url
        except:
            url = ''
        return url


class Book(models.Model):
    title = models.CharField(max_length=150)
    author = models.CharField(max_length=100)
    description = models.TextField(max_length=5000)
    category = models.CharField(max_length=100, null=True)
    date_created = models.CharField(max_length=11)
    # image = models.ImageField(upload_to='book-images/', default='book-images/74165.jpg')
    image = models.TextField(max_length=1000, null=True)

    # @property
    # def imageURL(self):
    #     try:
    #         url = self.image.url
    #     except:
    #         url = ''
    #     return url

    def __str__(self):
        return self.title


