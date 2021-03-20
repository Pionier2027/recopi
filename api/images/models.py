from django.db import models
import pandas as pd
import numpy as np
import keras
import tensorflow as tf
from keras.preprocessing.image import img_to_array
from django.conf import settings
from keras.preprocessing import image
from tensorflow.keras.models import load_model
import os
from PIL import Image as Img
# from tensorflow.python import ops
import tensorflow.compat.v1 as tfv1 
# from tensorflow.keras.applications.inception_resnet_v2 import InceptionResNetV2, decode_predictions, preprocess_input

# Create your models here.
class Image(models.Model):
    picture = models.ImageField()
    classified = models.CharField(max_length=200, blank=True)
    uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Image classified at {}".format(self.uploaded.strftime('%Y-%m-%d %H:%M'))

    def save(self, *args, **kwargs):
        LABELS = ['avogado','apple','banana','bean_sprouts','cabbage','carrot',
        'chicken','eggs','grape','green_onions','milk','miso','onion','orange',
        'pineapple','peach','potatoes','salt','shrimp','strawberry','tofu','yogurt']
        img_pil = Img.open(self.picture)
        img_path = os.path.join(os.path.dirname(settings.BASE_DIR), 'media_root/' + str(self.picture)) 
        img_pil.save(img_path, "JPEG")
        img = image.load_img(img_path, target_size=(224,224))
        img_array = image.img_to_array(img)
        to_pred = np.expand_dims(img_array, axis=0) #(1, 225, 225, 3)
        try:
            file_model = os.path.join(os.path.dirname(settings.BASE_DIR), 'model/vgg16_sample_22.h5')
            graph = tfv1.get_default_graph()
            
            with graph.as_default():
                model = load_model(file_model)
                print(dict(zip(LABELS, np.squeeze(model.predict(to_pred)).tolist())))
                pred = LABELS[np.argmax(model.predict(to_pred))]
                self.classified = str(pred)
                print(f'classified as {pred}')
        except Exception as e:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(e).__name__, e.args)
            print(message)
            print('failed to classify')
            self.classified = 'failed to classify'
        if os.path.exists(img_path):
            os.remove(img_path)
        else:
            print("The file does not exist")
        super().save(*args, **kwargs)