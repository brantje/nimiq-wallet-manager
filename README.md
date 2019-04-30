# Nimiq-Wallet-Manager

**Not ready for production, use only on testnet!**

## Requirements
- NodeJS (Tested on v10)
- MongoDB
- Redis
- HTTPS (This is required for webcrypto, see: [here](https://www.chromium.org/blink/webcrypto))

## Postman collection
[https://documenter.getpostman.com/view/3064651/RztkQALx#a776cefa-736c-4b12-8b9a-bac9d2347e1f](https://documenter.getpostman.com/view/3064651/RztkQALx#a776cefa-736c-4b12-8b9a-bac9d2347e1f)

## Self-signed certs
If you want ssl during development (see above), you can use the following command to generate an ssl cert:  
```shell 
openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout server.key -out server.crt
```
## Installation

```shell
### System dependencies
sudo apt-get install -y build-essential mongodb redis-server
# (On macOS: brew install mongo redis)

### Optionally, set up custom Mongo Database

### Download source
git clone https://github.com/brantje/nimiq-wallet-manager
cd nimiq-wallet-manager

### App dependencies
npm install

### Setup configuration
cp .env.sample .env
$EDITOR .env

### Install development dependencies
npm install -g webpack-cli nodemon

### Start Development Server
npm run watch
```
