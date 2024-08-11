import sys
import os

# 현재 스크립트가 위치한 디렉토리를 Python 패스에 추가합니다.
# 강제로 경로를 추가해줬습니다.
script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)
app_dir = os.path.join(project_dir, 'real_api')  # 애플리케이션 디렉토리 경로

sys.path.append(project_dir)
sys.path.append(app_dir)

import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ai_challenge.settings")
django.setup()

# 빨간줄로 경고가 있을 수 있습니다만, 실행됩니다.
from real_api.models import NaverNews, TodayIssue
from django.conf import settings


import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from datetime import timedelta
from bs4 import BeautifulSoup, NavigableString, Tag
from selenium import webdriver
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from bareunpy import Tagger
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import numpy as np
import requests
import platform
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics import pairwise_distances_argmin_min

from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

from django.utils import timezone
from datetime import datetime


article_count = 10


def get_webdriver():
    # 운영 체제에 따라 chromedriver 경로 설정
    os_name = platform.system().lower()

    # Chrome 옵션 설정 (예: headless 모드)
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # GUI 없이 실행
    chrome_options.add_argument("--no-sandbox")  # Sandbox 프로세스 사용 안 함
    chrome_options.add_argument("--disable-dev-shm-usage")  # /dev/shm 파티션 사용 안 함

    if os_name == "linux":
        chromedriver_path = "/home/ubuntu/chromedriver-linux64/chromedriver"  # Linux 경로

        # Chrome WebDriver 서비스 생성 및 실행
        service = Service(executable_path=chromedriver_path)
        driver = webdriver.Chrome(service=service, options=chrome_options)
        return driver
    elif os_name == "windows":
        # chromedriver_path = "C:\\Path\\To\\chromedriver.exe"  # Windows 경로

        # 문제가 있어서 여기서는 크롬이아닌, Edge를 사용.
        edge_service = Service(executable_path=EdgeChromiumDriverManager().install())
        driver = webdriver.Edge(service=edge_service)
        return driver
    else:
        raise Exception("Unsupported OS")


def crawling():
    # 페이지 소스 가져오기
    driver = get_webdriver()
    article_list = []

    # 마지막 페이지 확인하는 조건
    last_page_selector = "#contentarea_left > table > tbody > tr > td.pgRR"

    day_count = 0
    # 현재 날짜와 시간을 가져옴
    today = datetime.now()
    # 불러올 최소 기사의 수
    while True:
        if len(article_list) >= article_count:
            break

        # 오늘 날짜에서 하루를 빼서 어제의 날짜를 계산
        day_day = today - timedelta(days=day_count)
        # 어제의 날짜를 원하는 형식으로 출력
        formatted_date = day_day.strftime("%Y-%m-%d")
        BASE_URL = "https://finance.naver.com/news/mainnews.naver?date=" + formatted_date + "&page="

        # 첫 번째 페이지부터 시작하여 마지막 페이지까지 크롤링.
        current_page = 1
        while True:
            # 페이지마다 URL을 생성합니다.
            url = BASE_URL + str(current_page)
            driver.get(url)
            time.sleep(0.2)
            html = driver.page_source
            soup = BeautifulSoup(html, 'html.parser')

            # 페이지의 뉴스 항목을 크롤링
            for idx in range(1, 21):  # 한 페이지당 최대 20개의 기사가 있으므로 범위를 1부터 10까지
                article_dict = {}

                # 기사 제목과 링크 가져오기
                article_subjects = soup.select(
                    f'#contentarea_left > div.mainNewsList._replaceNewsLink > ul > li:nth-child({idx}) > dl > dd.articleSubject > a')

                for article_subject in article_subjects:
                    article_dict['article_title'] = article_subject.text.strip() if article_subject else None
                    article_dict['article_link'] = article_subject['href'] if article_subject else None

                # 기사 요약, 언론사, 날짜 및 시간 가져오기
                article_summary = soup.select_one(
                    f'#contentarea_left > div.mainNewsList._replaceNewsLink > ul > li:nth-child({idx}) > dl > dd.articleSummary')
                if article_summary:
                    # Summary 정리
                    summary_text = article_summary.text.strip().replace('\n', '').replace('\t', '')
                    article_dict['article_summary'] = summary_text.split('Press')[0].strip()

                    # 언론사 정보 확인
                    press_tag = article_summary.find('span', class_='press')
                    article_dict['press'] = press_tag.text.strip() if press_tag else None

                    # 날짜 및 시간 정보 확인
                    date_time_tag = article_summary.find('span', class_='wdate')
                    date_time = date_time_tag.text.strip() if date_time_tag else None
                    article_dict['date_time'] = date_time[:-3]

                if article_dict.get('article_link'):
                    article_list.append(article_dict)

            # 다음 페이지 확인
            try:
                next_button = WebDriverWait(driver, 3).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, last_page_selector)))
                if 'disabled' in next_button.get_attribute('class'):
                    break
            except TimeoutException:
                break

            # 다음 페이지로 이동합니다.
            current_page += 1

        day_count += 1

    # WebDriver 종료
    driver.quit()

    print("[+] crawling done")

    # # 확인용 출력
    # for idx, article in enumerate(article_list, start=1):
    #     print(f"Article {idx}:")
    #     print(f"Title: {article.get('article_title', 'N/A')}")
    #     print(f"Link: {article.get('article_link', 'N/A')}")
    #     print(f"Summary: {article.get('article_summary', 'N/A')}")
    #     print(f"Press: {article.get('press', 'N/A')}")
    #     print(f"Date & Time: {article.get('date_time', 'N/A')}")
    #     print()

    return article_list


#### 크롤링 후 처리
# 바른AI를 사용해 형태소 분석을 진행
# https://docs.bareun.ai/install/docker/
API_KEY = "koba-NQ2RURQ-QOGEAYY-R5YGZAY-CO6TZNY"
tagger = Tagger(API_KEY, 'localhost', 5757)

# Sentence Transformer 모델 로드
model = SentenceTransformer('ddobokki/klue-roberta-small-nli-sts')


# 키워드를 뽑는 로직. 코사인 유사도로 본문과 가장 연관있을것 같은 단어를 추출
def mmr(doc_embedding, candidate_embeddings, words, top_n, diversity):
    word_doc_similarity = cosine_similarity(candidate_embeddings, doc_embedding.reshape(1, -1))
    word_similarity = cosine_similarity(candidate_embeddings)

    keywords_idx = [np.argmax(word_doc_similarity)]
    candidates_idx = [i for i in range(len(words)) if i != keywords_idx[0]]

    for _ in range(top_n - 1):
        candidate_similarities = word_doc_similarity[candidates_idx, :]
        target_similarities = np.max(word_similarity[candidates_idx][:, keywords_idx], axis=1)

        mmr_values = (1 - diversity) * candidate_similarities.T - diversity * target_similarities
        mmr_idx = candidates_idx[np.argmax(mmr_values)]

        keywords_idx.append(mmr_idx)
        candidates_idx.remove(mmr_idx)

    top_keywords = '_'.join([words[idx] for idx in keywords_idx])
    return top_keywords


# 본문의 텍스트에서 테그를 떼줍니다.
def crawling_extraction(url):
    response = requests.get(url)
    time.sleep(0.2)  # 서버에 과부하를 주지 않기 위해 잠시 대기
    soup = BeautifulSoup(response.content, "html.parser")

    article = soup.find("article")
    if article:
        article_text = article.get_text(strip=True)
    else:
        article_text = "No article text found"

    return article_text

# 불용어 목록 로드
def load_stop_words(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        stop_words = set(line.strip() for line in file)
    return stop_words


def keyword_ext(text, stop_words):
    tokenized_doc = tagger.pos(text)
    # stop_words를 고려하여 불용어가 아닌 명사만 추가
    tokenized_nouns = ' '.join(
        [word[0] for word in tokenized_doc if word[1] in ['NNG', 'NNP'] and word[0] not in stop_words])

    n_gram_range = (1, 1)
    # 예외 처리 추가
    try:
        count = CountVectorizer(ngram_range=n_gram_range).fit([tokenized_nouns])
        candidates = count.get_feature_names_out()
    except ValueError:
        # 예외 발생 시(불용어만 있는경우...)
        return ["불용어", "밖에", "없는경우"], tokenized_nouns

    doc_embedding = model.encode([text])[0]
    candidate_embeddings = model.encode(candidates)

    return mmr(doc_embedding, candidate_embeddings, candidates, top_n=3, diversity=0.3)


def kmeans_clustering(headline_list):
    # 텍스트 벡터화
    tfidf_vectorizer = TfidfVectorizer()

    if headline_list:
        # TF-IDF로 벡터화
        tfidf_matrix = tfidf_vectorizer.fit_transform(headline_list)

        # KMeans 클러스터링 수행
        # 지금은 고정적으로 5개로 주고있지만, 나중에는 더 적절한값을 추출해서
        # 사용하는게 좋을겁니다.
        kmeans = KMeans(n_clusters=5, random_state=42)
        kmeans.fit(tfidf_matrix)

        # 클러스터의 중심에 가장 가까운 기사를 선택
        closest, _ = pairwise_distances_argmin_min(kmeans.cluster_centers_, tfidf_matrix)

        # 대표 기사들의 인덱스 리스트 생성
        # np.int64를 일반 Python int로 변환
        search_result = [int(idx) for idx in closest]

        return search_result
    else:
        return []


# 타임존으로 변경
def parse_date(date_str):
    try:
        naive_date = datetime.strptime(date_str, '%Y-%m-%d %H:%M')
        # 타임존 값으로 변경
        aware_date = timezone.make_aware(naive_date, timezone.get_current_timezone())
        return aware_date
    except ValueError:
        # 위기상황 발생! 발생! 발생!
        print("Date format error")
        return None


def method():
    article_list = crawling()

    file_path = os.path.join(settings.BASE_DIR, 'real_api', 'stop_words.txt')
    stop_word = load_stop_words(file_path)

    def process_article(article, stop_word):
        try:
            content = crawling_extraction(article['article_link'])
        except requests.exceptions.RequestException as e:
            print(f"Failed to retrieve article content from {article['article_link']}: {e}")
            return None

        keyword = keyword_ext(content, stop_word)
        news_date = parse_date(article['date_time'])

        news, created = NaverNews.objects.get_or_create(
            news_id=article['article_link'],
            defaults={
                'headline': article['article_title'],
                'content': content,
                'keyword': keyword,
                'news_date': news_date,
                'news_press': article['press'],
            }
        )

        return (article['article_title'], article['date_time'], article['article_link']) if created else None

    # ThreadPoolExecutor와 tqdm을 사용한 병렬 처리
    headline_arr = []
    # TODO 중요! 자주 튕기거나 멈추면, max_workers를 낮춰보세요. 반대로 높이면 빨라지긴합니다.
    # Intel OpenMP와 LLVM OpenMP가 동시에 로드되어 데드락 문제가 발생할 수 있습니다.
    # 문제없긴한데, 문제가 생기면 개발자에게 연락하세요...
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(process_article, article, stop_word) for article in article_list]

        for future in tqdm(as_completed(futures), total=len(futures), desc="Processing articles"):
            result = future.result()
            if result:
                headline_arr.append(result[0])

    # KMeans 클러스터링
    issue_arr = kmeans_clustering(headline_arr)

    # TodayIssue에 데이터 추가
    for index in issue_arr:
        today = TodayIssue.objects.create(
            date=parse_date(article_list[index]['date_time']),
            news_url=article_list[index]['article_link']
        )

# # 수동 크롤링
# if __name__ == '__main__':
#     method()