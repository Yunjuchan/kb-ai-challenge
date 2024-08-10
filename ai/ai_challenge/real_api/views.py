from django.shortcuts import render

from django.http import HttpResponse
from .news_crawling import method  # method가 news_crawling.py에 정의되어 있다고 가정

def run_method(request):
    try:
        method()  # method()를 호출하여 작업을 수행합니다.
        return HttpResponse("Method executed successfully.")
    except Exception as e:
        return HttpResponse(f"An error occurred: {e}", status=500)