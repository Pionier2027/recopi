# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from scrapy import Spider

from spider.models import DB_Driver, RakutenRecipe
from spider.utils.constants import LOG_FILE_PATH
from spider.utils.logger import getLogger
from spider.utils.slack_notify import SlackNotify
from spider.utils.spider_utils import SpiderUtils

from .items import SpiderItem

logger = getLogger(__name__, LOG_FILE_PATH)


class SpiderPipeline:
    BULK_SIZE = 1000

    def __init__(self):
        self._rakuten_recipe = RakutenRecipe()
        self._db_driver = DB_Driver()
        self._spider_utils = SpiderUtils()
        self._slack = SlackNotify()
        self._recipes = list()
        self._num_recipes = 0

    def open_spider(self, spider: Spider) -> None:
        """スパイダーの起動前に呼び出されるメソッド

        Args:
            spider (Spider): スパイダークラスのインスタンス
        """
        # self._db_driver.delete_tables()
        self._db_driver.create_tables()

        self._slack.slack_notify("[楽天レシピ] 収集処理を開始")
        spider.start_urls = self._spider_utils.get_start_urls()
        logger.info(f"start_urls: {spider.start_urls}")

    def process_item(self, item: SpiderItem, spider: Spider) -> SpiderItem:
        """スパイダーからレシピ情報をDBに保存

        Args:
            item (SpiderItem): スパイダーから返されるアイテムオブジェクト
            spider (Spider): スパイダークラスのインスタンス
        Returns:
            item: DBに保存するアイテムオブジェクト
        """

        if isinstance(item, SpiderItem):
            recipe_rows = dict(
                # 　ヘッダーのところから収集する情報
                item
            )
            self._recipes.append(recipe_rows)

            if len(self._recipes) == self.BULK_SIZE:
                logger.info(f"レシピ情報を{self.BULK_SIZE}件、DBに保存しました")
                self._slack.slack_notify(f"[楽天レシピ] レシピ情報を{self.BULK_SIZE}件追加")
                self._rakuten_recipe.bulk_insert(self._recipes)
                self._num_recipes += self.BULK_SIZE
                self._recipes = list()
            return item

    def close_spider(self, spider: Spider) -> None:
        """スパイダー終了時に呼び出されるメソッド

        Args:
            spider (Spider): スパイダークラスのインスタンス
        """

        try:
            # 余りの楽天レシピ情報追加
            self._rakuten_recipe.bulk_insert(self._recipes)
            self._num_recipes += len(self._recipes)
            logger.info(f"[楽天レシピ] レシピ情報 追加: 追加件数{self._num_recipes}件")
            self._slack.slack_notify(f"[楽天レシピ] レシピ情報 追加: 追加件数{self._num_recipes}件")
        except Exception as error:
            logger.exception(error, extra=dict(spider=spider))
            raise
