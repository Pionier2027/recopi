rakuten_recipe:
	@poetry run scrapy crawl rakuten_recipe_spider

lint:
	@poetry run isort spider

clean:
	@rm -rf log/*.log

.PHONEY: lint clean