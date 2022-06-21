from typing import Dict, List

from crawler_utils.db import BASE, DBAdapter
from sqlalchemy import Column, func
from sqlalchemy.sql.sqltypes import TEXT, TIMESTAMP, Integer

db_adapter = DBAdapter(  # nosec
    dotenv_path=".env",
    env_db_host="DB_HOST",  # DB_HOST # SD_DB_HOST # MART_DB_HOST
    env_db_name="DB_NAME",  # DB_NAME # SD_DB_NAME # MART_DB_NAME
    env_db_user="DB_USER",  # DB_USER # SD_DB_USER # MART_DB_USER
    env_db_pass="DB_PASS",  # DB_PASS # SD_DB_PASS # MART_DB_PASS
    db_type="postgresql",
)


class RakutenRecipe(BASE):
    __tablename__ = "rakuten_recipe"
    id = Column(Integer, primary_key=True, comment="DBに付与されるID")
    crawled_url = Column(TEXT, nullable=False, unique=True, comment="参照URL")
    title = Column(TEXT, nullable=False, comment="タイトル")
    serves = Column(TEXT, comment="何人分")
    ingredients = Column(TEXT, comment="材料")
    image_path = Column(TEXT, comment="料理の画像パス")

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        comment="作成日時",
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now(),
        comment="更新日時",
    )

    @staticmethod
    def bulk_insert(rakuten_recipe_list: List[Dict]) -> None:
        """
        楽天レシピから収集したレシピをまとめて保存
        """
        rakuten_recipes = [RakutenRecipe(**dc) for dc in rakuten_recipe_list]
        db_adapter.session.bulk_save_objects(rakuten_recipes, return_defaults=True)
        db_adapter.session.commit()


class DB_Driver:
    @staticmethod
    def create_tables() -> None:
        """
        テーブルの作成
        """
        db_adapter.make_tables(tables=[RakutenRecipe])

    @staticmethod
    def delete_tables() -> None:
        """
        テーブルの削除
        """
        db_adapter.delete_tables(tables=[RakutenRecipe])
