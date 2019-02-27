#!/bin/bash

rm -rf /tmp/fabric-client-kvs_peerOrg*

export N_PREFIX=$HOME/n
export PATH=$N_PREFIX/bin:$PATH

# mysql -u root
# mysql> USE mysql;
# mysql> UPDATE user SET authentication_string=PASSWORD("123456") WHERE User='root';
# mysql> FLUSH PRIVILEGES;
# mysql> quit

mysql.server stop
mysql.server start
sleep 1

mysql -uroot -proot < db/fabricexplorer.sql

#node main.js >log.log 2>&1 &
node main.js
