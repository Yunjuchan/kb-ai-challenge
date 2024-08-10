import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import platform
import os

article_count = 500


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

        chrome_service = Service(executable_path=ChromeDriverManager().install())
        driver = webdriver.Chrome(service=chrome_service)
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

    # 확인용 출력
    for idx, article in enumerate(article_list, start=1):
        print(f"Article {idx}:")
        print(f"Thumbnail URL: {article.get('thumbnail_url', 'N/A')}")
        print(f"Title: {article.get('article_title', 'N/A')}")
        print(f"Link: {article.get('article_link', 'N/A')}")
        print(f"Summary: {article.get('article_summary', 'N/A')}")
        print(f"Press: {article.get('press', 'N/A')}")
        print(f"Date & Time: {article.get('date_time', 'N/A')}")
        print()

    return article_list


if __name__ == '__main__':
    crawling()
