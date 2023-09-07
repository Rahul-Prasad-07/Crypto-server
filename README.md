# Crypto-server

## Steps to start server

1. start redis server
 - `sudo service redis-server start`
2. start redis-cli
 - `redis-cli`
3. start the node server
 - `nodemon index.js`

## Post-man collection

All are GET req

- http://localhost:3000/crypto/top10
- http://localhost:3000/crypto/top20
- http://localhost:3000/crypto/SOL
- http://localhost:3000/crypto/SOL/price
