#!/bin/bash

pm2 start node/run.js --name BTCUSDT -- BTCUSDT diaria-6-21-50 true
pm2 start node/run.js --name ETHUSDT -- ETHUSDT diaria-6-21-50 true
pm2 start node/run.js --name EOSUSDT -- EOSUSDT diaria-6-21-50 true
pm2 start node/run.js --name ADAUSDT -- ADAUSDT diaria-6-21-50 true
pm2 start node/run.js --name XMRUSDT -- XMRUSDT diaria-6-21-50 true
pm2 start node/run.js --name ETCUSDT -- ETCUSDT diaria-6-21-50 true
pm2 start node/run.js --name NEOUSDT -- NEOUSDT diaria-6-21-50 true
pm2 start node/run.js --name VETUSDT -- VETUSDT diaria-6-21-50 true
pm2 start node/run.js --name ICXUSDT -- ICXUSDT diaria-6-21-50 true

pm2 save
