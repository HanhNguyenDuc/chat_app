from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
# form that gonna be used for django-admin site
from .models import Member


# two forms below gonna be used in django-admin site, we can create another normal form to use 
class MemberCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Member
        # fields = ('username', 'password1', 'password2', 'email', 'first_name', 'last_name', 'gen')


class MemberChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = Member
        # fields = ('email', 'first_name', 'last_name', 'gen')

# class MemberCreationForm(forms.ModelForm):
#     class Meta:
#         model = Member
#         fields = ('username', 'password', 'first_name', 'last_name')

class MemberNormalCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Member
        # fields = list(UserCreationForm.Meta.fields).append("gen")
        # exclude = ["groups", "user permissions"]
        fields = ["username", "email", "password1", "password2", "first_name", "last_name", "gen"]