import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule


class RakutenRecipeSpiderSpider(CrawlSpider):
    name = "rakuten_recipe_spider"
    allowed_domains = ["recipe.rakuten.co.jp"]
    start_urls = ["http://recipe.rakuten.co.jp/"]

    rules = (Rule(LinkExtractor(allow=r"Items/"), callback="parse_item", follow=True),)
    # //li[@class="recipe_ranking__item"]/a

    def parse_item(self, response):
        item = {}
        # item['domain_id'] = response.xpath('//input[@id="sid"]/@value').get()
        # item['name'] = response.xpath('//div[@id="name"]').get()
        # item['description'] = response.xpath('//div[@id="description"]').get()
        return item
