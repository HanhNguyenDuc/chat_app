from django.shortcuts import render
from .forms import MemberNormalCreationForm
from .models import Member, Friend
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import decorators

# Create your views here.

def sign_up_view(request):
    if request.method == 'POST':
        form = MemberNormalCreationForm(request.POST)
        if form.is_valid():
            form.save()
        
        return HttpResponseRedirect('/login')
    
    form = MemberNormalCreationForm()

    return HttpResponse(render(request, 'chat/signup.html', {'form': form}))

def home_view(request):
    if request.method == "POST":
        roomname = request.POST['roomname']
        return HttpResponseRedirect('/room/{}'.format(roomname))
    return HttpResponse(render(request, 'chat/home.html', {}))


@decorators.login_required(login_url='chat/login')
def room_view(request, roomname):
    
    # get friend list
    users = Member.objects.all()
    cur_user = None
    if request.user.is_authenticated:
        cur_user = request.user.username

    return HttpResponse(render(request, 'chat/chatroom.html', {'roomname': roomname, 'users': users, 'cur_user': cur_user}))