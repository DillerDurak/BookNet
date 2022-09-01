from django.urls import path
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('login/', LoginUser.as_view(), name='login'),
    path('registration/', RegisterUser.as_view(), name='registration'),
    path('logout/', user_logout, name='logout'),
    path('book-list/<int:pk>/', bookList, name='book-list'),
    path('add-book/', addBook),
]
