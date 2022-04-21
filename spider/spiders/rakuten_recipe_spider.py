import json
import re

import mojimoji
from scrapy.linkextractors import LinkExtractor
from scrapy.http.response.html import HtmlResponse
from scrapy.loader import ItemLoader
from scrapy.spiders import CrawlSpider, Rule

from spider.items import SpiderItem
from spider.utils.constants import LOG_FILE_PATH
from spider.utils.logger import getLogger

logger = getLogger(__name__, LOG_FILE_PATH)


class RakutenRecipeSpiderSpider(CrawlSpider):
    name = "rakuten_recipe_spider"
    allowed_domains = ["recipe.rakuten.co.jp"]
    regex_n = re.compile(r"^\n")
    regex_ten = re.compile(r"^・")

    rules = (
        Rule(
            LinkExtractor(restrict_xpaths="//li[@class='recipe_ranking__item']/a"),
            callback="parse_recipe",
            follow=False,
        ),
        Rule(
            LinkExtractor(
                restrict_xpaths="//div[@class='box_pagenation']/ul/li[position()=last()]"
            )
        ),
    )

    def parse_recipe(self, response: HtmlResponse) -> SpiderItem:
        """楽天レシピの詳細ページからレシピ情報を取得

        Args:
            response (HtmlResponse): レシピ詳細ページのHTMLレスポンス
        Returns:
            item: DBに保存するアイテムオブジェクト
        """

        logger.info(f"参照URL: {response.url}")
        rakuten_recipe_item = ItemLoader(item=SpiderItem(), response=response)
        ingredients = dict()
        ingredients_elems = response.xpath('//li[@class="recipe_material__item"]')

        try:
            serves = response.xpath(
                "//section[@class='recipe_material mb32']/h2[@class='contents_title contents_title_mb']/text()"
            ).get()
        except Exception:
            serves = None

        for ingredients_elem in ingredients_elems:
            amount = ingredients_elem.xpath(
                ".//span[@class='recipe_material__item_serving']/text()"
            ).get()
            if amount is not None:
                ingredient_name = ingredients_elem.xpath(
                    ".//span[@class='recipe_material__item_name']/text()"
                ).get()
                # NOTE: \nで始まっていたら
                if self.regex_n.search(ingredient_name):
                    ingredient_name = ingredients_elem.xpath(
                        ".//span[@class='recipe_material__item_name']/a/text()"
                    ).get()
                    if self.regex_ten.search(ingredient_name):
                        pre_ingredient_name = re.sub(
                            r"[^ぁ-んァ-ン一-龥ー]", "", ingredient_name
                        )
                    else:
                        pre_ingredient_name = re.sub(
                            r"[^ぁ-んァ-ン一-龥ー・]", "", ingredient_name
                        )
                else:
                    if self.regex_ten.search(ingredient_name):
                        pre_ingredient_name = re.sub(
                            r"[^ぁ-んァ-ン一-龥ー]", "", ingredient_name
                        )
                    else:
                        pre_ingredient_name = re.sub(
                            r"[^ぁ-んァ-ン一-龥ー・]", "", ingredient_name
                        )

                ingredients[pre_ingredient_name] = mojimoji.zen_to_han(
                    re.sub("■", "", amount)
                )

        # logger.info(f"材料: {ingredients}")

        rakuten_recipe_item.add_value("crawled_url", response.url)
        rakuten_recipe_item.add_xpath("title", '//h1[@class="page_title__text"]/text()')
        rakuten_recipe_item.add_value("serves", mojimoji.zen_to_han(serves))
        rakuten_recipe_item.add_value(
            "ingredients", json.dumps(ingredients, ensure_ascii=False)
        )
        rakuten_recipe_item.add_xpath(
            "image_path", "//div[@class='recipe_info_img']/img/@src"
        )

        return rakuten_recipe_item.load_item()
