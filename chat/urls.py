# from django.contrib import admin
from django.urls import path
from django.contrib.auth.views import LoginView
from .views import sign_up_view, home_view, room_view

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('login/', LoginView.as_view(template_name="chat/login.html"), name="login"),
    path('signup/', sign_up_view, name="signup"),
    path('', home_view, name="home"),
    path('room/<str:roomname>', room_view, name="room"),
]