from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from .models import User


class LoginForm(AuthenticationForm):
    username = forms.CharField(label="Username", max_length=30, widget=forms.TextInput(attrs={'class': 'input'}))
    password = forms.CharField(label="Password", widget=forms.PasswordInput(attrs={'class': 'input'}))


class RegistrationForm(UserCreationForm):
    email = forms.EmailField(label="E-mail", widget=forms.EmailInput(attrs={'class': 'input'}))
    username = forms.CharField(label="Username", max_length=30, widget=forms.TextInput(attrs={'class': 'input'}))
    password1 = forms.CharField(label="Password", widget=forms.PasswordInput(attrs={'class': 'input'}))
    password2 = forms.CharField(label="Password Confirmation", widget=forms.PasswordInput(attrs={'class': 'input'}))

    class Meta:
        model = User
        fields = ['username', 'password1', 'password2', 'email']