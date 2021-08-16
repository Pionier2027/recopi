from django.db import models
import numpy as np
from django.conf import settings
from keras.preprocessing import image
from tensorflow.keras.models import load_model
import os
from PIL import Image as Img
import tensorflow.compat.v1 as tfv1 

# データベーススキーマーImageテーブルのスキーマ
class Image(models.Model):
    # 画像コラム
    picture = models.ImageField()
    # 判別結果コラム
    classified = models.CharField(max_length=200, blank=True)
    # 判定日時コラム
    uploaded = models.DateTimeField(auto_now_add=True)

    # adminページで判定画像DBにアクセスする時の表示フォーマット
    def __str__(self):
        return "Image classified at {}".format(self.uploaded.strftime('%Y-%m-%d %H:%M'))

    def save(self, *args, **kwargs):

        # フルバージョン　２２種類の食材
        # LABELS = ['avogado','apple','banana','bean_sprouts','cabbage','carrot',
        # 'chicken','eggs','grape','green_onions','milk','miso','onion','orange',
        # 'pineapple','peach','potatoes','salt','shrimp','strawberry','tofu','yogurt']

        # ミニバージョン　５種類の食材
        LABELS = ['cabbage', 'carrot', 'milk', 'onion', 'tofu']

        # フロントから送られてきた画像をImgオブジェクトとして保存
        img_pil = Img.open(self.picture)

        # ベースディレクトリ api + media_root + 判定用画像名
        img_path = os.path.join(settings.BASE_DIR, 'media_root/' + str(self.picture))

        # 上のパス上に画像を保存
        img_pil.save(img_path, "JPEG")

        # 保存後に画像を学習時のサイズで読み込み、imageオブジェクトとして保存
        img = image.load_img(img_path, target_size=(224,224))

        # 上のオブジェクトをnumpy配列に変換
        img_array = image.img_to_array(img)

        # モデルの入力フォーマットに合わせ、axis=0の次元を追加（１はデータ数が一個であることを表す）
        to_pred = np.expand_dims(img_array, axis=0) #(1, 225, 225, 3)

        try:
            # モデルの保存パスを指定
            file_model = os.path.join(settings.BASE_DIR, 'model/fridgeCF2_20210808_172513.h5')

            # デフォルトのグラフにアクセス
            graph = tfv1.get_default_graph()
            
            # グラフ上での演算を指定
            with graph.as_default():
                # VGG16モデルをロードし、保存
                model = load_model(file_model)

                # 各食材の判定確率をコンソール上で確認(デバッグ時確認用)
                # print(dict(zip(LABELS, np.squeeze(model.predict(to_pred)).tolist())))

                # モデルを用いて各食材の判定確率が保存されたnumpy配列をリターン
                pred_prob = model.predict(to_pred)

                # 判定確率が0.8以上の食材があれば、
                if (pred_prob >= 0.8).any():
                    # 一番判定確率が高い食材のインデックスをラベルが保存されているリストと照らし合わせ、食材名を保存
                    pred_ingred = LABELS[np.argmax(model.predict(to_pred))]

                # 判定確率が0.8以上の食材がない場合、
                else:
                    raise Exception

                # classifiedコラムのレコードを判定食材名で保存
                self.classified = str(pred_ingred)
                print(f'classified as {pred_ingred}')

        except Exception as e:
            # デバッグ用にエラーの詳細を出力
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(e).__name__, e.args)
            print(message)
            print('failed to classify')

            # classifiedコラムのレコードを誤判定として保存
            self.classified = 'failed to classify'
            
        # 判定終了したイメージファイルをローカルパスから削除（以後DB上で保存管理）
        if os.path.exists(img_path):
            os.remove(img_path)
        else:
            print("The file does not exist")

        # DBのレコードとして挿入し、コミット
        super().save(*args, **kwargs)