# Django & React application

This is a set up so that we can easily create apps that use Django on the backend (and take advantage of the amazing admin UI) and React (set up with [`create-react-app`](https://npm.im/create-react-app)) for the front end application.

## Running

1. `docker-compose build`
1. `docker-compose up`
1. There should now be two servers running:
  - [http://127.0.0.1:5000](http://127.0.0.1:5000) is the Django app
  - [http://127.0.0.1:3000](http://127.0.0.1:3000) is the React app

## Using `docker-compose run` to issue one-off commands

If you want to run a one-off command, like installing dependencies, you can use the `docker-compose run <service_name> <cmd>`.

For example, to install a Javascript dependency and save that information to `package.json` we could run:
`docker-compose run --rm frontend npm install --save axios`

If you want to be on a shell for one of the Docker services, you can do something like:
`docker-compose run --rm frontend bash`



Things I want to add:
- config for circle to deploy on `master` (wondering if i can get default branch name) and tagged releases
- React Router
- Redux & directory structure
- A server side rendering
- Service Workers and easy to config [strategies](https://jakearchibald.com/2014/offline-cookbook/)
- Instructions on easy deployment to cloud.gov
- Directory structure?
- USWDS in some form?

## FridgeClassifier
Web Application for automating the process of storing ingredients and recommending recipes

# Roles
- Seiya Umemoto: Project Manager, Front/Back End
- Takamichi Nomura: AI Tuning
- Daeho Bang: Data Collection, Data Preprocessing

# Description
![image1](https://github.com/Seiya-Umemoto/FridgeClassifier/blob/master/readme/smartrg1.jpg)

![image2](https://github.com/Seiya-Umemoto/FridgeClassifier/blob/master/readme/smartrg2.jpg)

# Necessary packages for backend (Django)
- absl-py==0.9.0
- astor==0.8.1
- cachetools==4.0.0
- certifi==2019.11.28
- chardet==3.0.4
- Django==2.2
- django-cors-headers==3.2.0
- djangorestframework==3.11.0
- gast==0.2.2
- google-auth==1.10.0
- google-auth-oauthlib==0.4.1
- google-pasta==0.1.8
- grpcio==1.26.0
- h5py==2.10.0
- idna==2.8
- joblib==0.14.1
- Keras==2.3.1
- Keras-Applications==1.0.8
- Keras-Preprocessing==1.1.0
- Markdown==3.1.1
- numpy==1.18.0
- oauthlib==3.1.0
- opencv-python==4.1.2.30
- opt-einsum==3.1.0
- pandas==0.25.3
- Pillow==6.2.1
- protobuf==3.11.2
- pyasn1==0.4.8
- pyasn1-modules==0.2.7
- python-dateutil==2.8.1
- pytz==2019.3
- PyYAML==5.2
- requests==2.22.0
- requests-oauthlib==1.3.0
- rsa==4.0
- scikit-learn==0.22
- scipy==1.4.1
- six==1.13.0
- sqlparse==0.3.0
- tensorboard==2.0.2
- tensorflow==2.0.0a0
- tensorflow-estimator==2.0.1
- termcolor==1.1.0
- urllib3==1.25.7
- Werkzeug==0.16.0
- wrapt==1.11.2

# Necessary packages for front end (React)
- "axios": "^0.20.0",
- "bootstrap": "^4.5.2",
- "react-bootstrap": "^1.3.0",
- "react-dropzone": "^11.2.0",
- "react-router-dom": "^5.2.0",