from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import MemberCreationForm, MemberChangeForm
from .models import Member, Friend, Profile


# Register your models here.
class MemberAdmin(UserAdmin):
    add_form = MemberCreationForm
    form = MemberChangeForm
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('gen', )}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('gen', )}),
    )

admin.site.register(Member, MemberAdmin)
admin.site.register(Friend)
admin.site.register(Profile)