from typing import List

import requests
from bs4 import BeautifulSoup


class SpiderUtils:
    BASE_URL = "https://recipe.rakuten.co.jp"

    def __init__(self) -> None:
        pass

    def get_start_urls(self) -> List[str]:
        """クローリングを開始するURLを取得する関数

        Returns:
            start_urls: クローリングを開始するURL
        """
        url = "https://recipe.rakuten.co.jp/category/"
        soup = BeautifulSoup(requests.get(url).text, "html.parser")

        crawled_urls = soup.find_all("a", class_="category_top-list__link")

        start_urls = [
            self.BASE_URL + crawled_url["href"] for crawled_url in crawled_urls
        ]

        return start_urls
