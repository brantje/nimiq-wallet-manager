# Nimiq-Wallet-Manager

## Requirements
- NodeJS (Tested on v10)
- MongoDB
- Redis
- HTTPS (This is required for webcrypto, see: https://www.chromium.org/blink/webcrypto)


## Postman collection
https://documenter.getpostman.com/view/3064651/RztkQALx#a776cefa-736c-4b12-8b9a-bac9d2347e1f

## Self-signed certs
If you want ssl during development (see above), you can use the following command to generate an ssl cert:  
`openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout server.key -out server.crt`
## Installation
Setup a fresh MongoDB database.

`$ sudo apt-get install -y build-essential mongodb redis-server`

`$ npm install`

`$ cp .env.sample .env`

`$ nano .env`

`$ npm run watch`
