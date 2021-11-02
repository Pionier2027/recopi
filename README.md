# recopi
Web Application for automating the process of storing ingredients and recommending recipes

## Check Document below first(In Japanese)
[recopi_document(in Japanese)](https://sunmoonackr-my.sharepoint.com/:w:/g/personal/seiyau77_sunmoon_ac_kr/EZ2F7x-55cFFvMbL-gBhcYkBftBZOspK7cnXuZyzJP81oA?e=dqTqVi)

## Roles
- Seiya Umemoto: Project Manager, Front/Back End
- Takamichi Nomura: AI Tuning
- Daeho Bang: Data Collection, Data Preprocessing

## Description
![image1](https://github.com/Pionier2027/recopi/blob/main/readme/smartrg1.jpg?raw=true)

![image2](https://github.com/Pionier2027/recopi/blob/main/readme/smartrg2.jpg?raw=true)

## Demo Video
[![demo_video](https://github.com/Pionier2027/recopi/blob/main/readme/smartrg_demo_pic.png?raw=true)](https://sunmoonackr-my.sharepoint.com/:v:/g/personal/seiyau77_sunmoon_ac_kr/ETZ_mhZaOkREvqAyERtMMdkBBsInM9R2cZA3jXTO9abOZw?e=BBeuPH)

## Future Plan
- Introduce a raspberry pi camera and an audio input to recognize actual ingredients stored in a fridge.
- Improve the performance of image recognition and detection by replacing the vgg16 with YOLO
- Add Japanese and Korean version of recommendation of recipes

# How to run this app?
## First please check if Docker is installed on your PC
For Windows users:
Please first install [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) if you don't have it installed.


## Download weight files
1. download [a weight file of VGG16](https://sunmoonackr-my.sharepoint.com/:u:/g/personal/seiyau77_sunmoon_ac_kr/EbsUNKEqfjxOoglvmVzr4zkBMRQ4cuhYtCpnwOtZWcpJYA?e=gVedY0)
1. Save the files above into `recopi/api/model`(create this directory if it doesn't exist)

## Initial Running
1. `docker-compose up --build -d`
1. `bash django_setup.sh`
1. There should now be three servers running:
  - [http://127.0.0.1:8000](http://127.0.0.1:8000) is the Django app
  - [http://127.0.0.1:3000](http://127.0.0.1:3000) is the React app
  - [http://127.0.0.1:5432](http://127.0.0.1:5432) is the PostgreSQL Database

## Checking working containers
  - `docker-compose ps`

## Closing(must include -v)
  - `docker-compose down -v`

## Rerunning(without build/rerun django setup file)
  - `docker-compose up -d`
  - `bash django_setup.sh`