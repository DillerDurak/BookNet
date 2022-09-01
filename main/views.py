from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.views import LoginView
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView
import json

from .forms import *
from .models import *


def home(request):
    user = request.user
    context = {'user': user}
    return render(request, 'main/book.html', context)


def bookList(request, pk):
    books = Book.objects.filter(user__pk=pk)
    user = User.objects.get(pk=pk)
    context = {'books': books, 'user': user}
    return render(request, 'main/test.html', context)


class LoginUser(LoginView):
    form_class = LoginForm
    template_name = 'main/login.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

    def get_success_url(self):
        return reverse_lazy('home')


class RegisterUser(CreateView):
    form_class = RegistrationForm
    template_name = 'main/registration.html'

    def form_valid(self, form):
        form.save()
        username = self.request.POST['username']
        password = self.request.POST['password1']
        user = authenticate(self.request, username=username, password=password)
        login(self.request, user)
        return redirect('home')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

    def get_success_url(self):
        return reverse_lazy('home')


def user_logout(request):
    logout(request)
    return redirect('home')


def addBook(request):
    if not request.user.is_authenticated:
        print('error')
        return JsonResponse({'error': 'Error connection'})


    data = json.loads(request.body)

    title = data['title']
    author = data['author']
    date_created = data['date_created']
    category = data['category']
    description = data['description']
    image = data['image']
    
    user = request.user

    book, created = Book.objects.get_or_create(
        title=title,
        author=author,
        date_created=date_created,
        category=category,
        description=description,
        image=image
    )

    user.book.add(book)

    return JsonResponse('Book was added')

