# FridgeClassifier
Web Application for automating the process of storing ingredients and recommending recipes

## Roles
- Seiya Umemoto: Project Manager, Front/Back End
- Takamichi Nomura: AI Tuning
- Daeho Bang: Data Collection, Data Preprocessing

## Description
![image1](https://github.com/Pionier2027/recopi/blob/master/readme/smartrg1.jpg)

![image2](https://github.com/Pionier2027/recopi/blob/master/readme/smartrg2.jpg)

## Demo Video
[![demo_video](https://github.com/Pionier2027/recopi/blob/master/readme/smartrg_demo_pic.PNG?raw=true)](https://sunmoonackr-my.sharepoint.com/:v:/g/personal/seiyau77_sunmoon_ac_kr/ETZ_mhZaOkREvqAyERtMMdkBBsInM9R2cZA3jXTO9abOZw?e=BBeuPH)

## Future Plan
- Introduce a raspberry pi camera and an audio input to recognize actual ingredients stored in a fridge.
- Improve the performance of image recognition and detection by replacing the vgg16 with YOLO
- Add Japanese and Korean version of recommendation of recipes

# How to run this app?
## First please check if Docker is installed on your PC
For Windows users:
Please first install [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) if you don't have it installed.


## Download weight files
1. download [a weight file of VGG16](https://sunmoonackr-my.sharepoint.com/:u:/g/personal/seiyau77_sunmoon_ac_kr/Ea4K_0F4JR9OqOMhpIh-h7MBW2RtoMGYYwgQdnwkOYmong?e=yz5jn5)
1. Save the files above into `recopi/api/model`(create this directory if it doesn't exist)

## Running

1. `docker-compose up --build -d`
1. `bash django_setup.sh`
1. There should now be three servers running:
  - [http://127.0.0.1:8000](http://127.0.0.1:8000) is the Django app
  - [http://127.0.0.1:3000](http://127.0.0.1:3000) is the React app
  - [http://127.0.0.1:5432](http://127.0.0.1:5432) is the PostgreSQL Database

## Checking working containers
  - `docker-compose ps`

## Closing
  - `docker-compose down -v`

## Rerunning
  - `docker-compose up -d`
