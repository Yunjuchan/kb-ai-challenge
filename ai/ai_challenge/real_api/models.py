from django.db import models


class NaverNews(models.Model):
    news_id = models.URLField(primary_key=True)
    headline = models.CharField(max_length=255)
    content = models.TextField()
    keyword = models.CharField(max_length=255)
    news_date = models.DateTimeField()
    news_press = models.CharField(max_length=255)

    class Meta:
        db_table = 'naver_news'

    def __str__(self):
        return self.headline


class TodayIssue(models.Model):
    issue_id = models.AutoField(primary_key=True)
    date = models.DateField()
    news_url = models.URLField(max_length=200)

    class Meta:
        db_table = 'today_issue'

    def __str__(self):
        return f"Issue ID: {self.issue_id}, Date: {self.date}, News URL: {self.news_url}"
