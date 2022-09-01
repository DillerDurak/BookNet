from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import BookSerializer
from main.models import Book
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated


class BookCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = (IsAuthenticated,)
