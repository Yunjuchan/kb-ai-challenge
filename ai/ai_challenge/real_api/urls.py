from django.urls import path
from .views import run_method

urlpatterns = [
    path('run-method/', run_method, name='run_method'),
]