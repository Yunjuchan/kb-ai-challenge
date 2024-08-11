from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse
from .news_crawling import method  # method가 news_crawling.py에 정의되어 있다고 가정

@csrf_exempt
@require_http_methods(["POST"])
def run_method(request):
    try:
        method()  # method()를 호출하여 작업을 수행합니다.
        return HttpResponse("Method executed successfully.")
    except Exception as e:
        return HttpResponse(f"An error occurred: {e}", status=500)