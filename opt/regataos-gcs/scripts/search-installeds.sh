#!/bin/bash

# Verify that launchers or games are installed

cd /

while :
do

ps -C regataosgcs > /dev/null
if [ $? = 0 ]
then
	/opt/regataos-gcs/scripts/search-installed-launchers.sh start
	/opt/regataos-gcs/scripts/search-installed-games.sh start
fi

   sleep 5
done
