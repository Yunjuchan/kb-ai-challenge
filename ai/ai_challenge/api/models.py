# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class NaverNews(models.Model):
    news_id = models.AutoField(primary_key=True)
    headline = models.CharField(max_length=255)
    content = models.TextField()
    keyword = models.CharField(max_length=255)
    news_date = models.DateTimeField()
    news_press = models.CharField(max_length=255)

    def __str__(self):
        return self.headline


class TodayIssue(models.Model):
    issue_id = models.AutoField(primary_key=True)
    date = models.DateField()
    news_id = models.ForeignKey(NaverNews, on_delete=models.CASCADE)

    def __str__(self):
        return f"Issue on {self.date} - {self.news_id.headline}"
