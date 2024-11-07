# Generated by Django 5.1 on 2024-08-11 06:44

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NaverNews',
            fields=[
                ('news_id', models.URLField(primary_key=True, serialize=False)),
                ('headline', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('keyword', models.CharField(max_length=255)),
                ('news_date', models.DateTimeField()),
                ('news_press', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'naver_news',
            },
        ),
        migrations.CreateModel(
            name='TodayIssue',
            fields=[
                ('issue_id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('news_url', models.URLField()),
            ],
            options={
                'db_table': 'today_issue',
            },
        ),
    ]