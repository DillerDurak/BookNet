from rest_framework import serializers
from main.models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('title', 'author','category','date_created', 'description', 'image', 'book__user')