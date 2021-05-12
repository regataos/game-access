#!/bin/bash 

# Fixes for the game
gamepatch=$(grep -r "borderlands2" "/tmp/regataos-gcs/config/game-install-dir.conf" | cut -d"=" -f 2- | sed 's/Borderlands2.exe//')

if test ! -e "$gamepatch/regataos-gcs-revised.txt" ; then
	mv -f "$gamepatch/Launcher.exe" "$gamepatch/Launcher.exe.old"
	cp -f "$gamepatch/Borderlands2.exe" "$gamepatch/Launcher.exe"
	echo "This game has been fixed by the Regata OS Game Access." > "$gamepatch/regataos-gcs-revised.txt"
fi
