# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from itemloaders.processors import TakeFirst


class SpiderItem(scrapy.Item):
    crawled_url = scrapy.Field(output_processor=TakeFirst())
    title = scrapy.Field(output_processor=TakeFirst())
    serves = scrapy.Field(output_processor=TakeFirst())
    ingredients = scrapy.Field(output_processor=TakeFirst())
    image_path = scrapy.Field(output_processor=TakeFirst())
