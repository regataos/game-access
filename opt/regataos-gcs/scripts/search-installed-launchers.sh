#!/bin/bash

# This script searches the launcher's installation directory, when searching for its executable,
# and saves the information in the "installed-launchers.conf" file

# Create config directory
if test ! -e /tmp/regataos-gcs ; then
	mkdir -p /tmp/regataos-gcs
	chmod 777 /tmp/regataos-gcs
fi

if test ! -e "/tmp/regataos-gcs/config" ; then
	ln -sf "$HOME/.config/regataos-gcs" "/tmp/regataos-gcs/config"
fi

if test ! -e "/tmp/regataos-gcs/config/installed-launchers.conf" ; then
	echo "" > "/tmp/regataos-gcs/config/installed-launchers.conf"
fi

# Check if the launcher installation directory exists, looking for the launcher executable
function search_installed_launchers() {
	if [[ $search_in_gcs == *"$launcher_executable"* ]]; then
		if [[ $search_in_gcs == *"$launcher_name"* ]]; then
			if [[ $(grep -r "$launcher_nickname" "/tmp/regataos-gcs/config/installed-launchers.conf") != *"$launcher_nickname"* ]]; then
				echo "$launcher_nickname" >> "/tmp/regataos-gcs/config/installed-launchers.conf"
				sed -i '/^$/d' "/tmp/regataos-gcs/config/installed-launchers.conf"
			fi
		else
			echo "Launcher not installed or not found."
			if [[ $(grep -r "$launcher_nickname" "/tmp/regataos-gcs/config/installed-launchers.conf") == *"$launcher_nickname"* ]]; then
				sed -i "s/$launcher_nickname//" "/tmp/regataos-gcs/config/installed-launchers.conf"
				sed -i '/^$/d' "/tmp/regataos-gcs/config/installed-launchers.conf"
			fi
		fi

	elif [[ $search_in_wineprefixes == *"$launcher_executable"* ]]; then
		if [[ $search_in_wineprefixes == *"$launcher_name"* ]]; then
			if [[ $(grep -r "$launcher_nickname" "/tmp/regataos-gcs/config/installed-launchers.conf") != *"$launcher_nickname"* ]]; then
				echo "$launcher_nickname" >> "/tmp/regataos-gcs/config/installed-launchers.conf"
				sed -i '/^$/d' "/tmp/regataos-gcs/config/installed-launchers.conf"
			fi
		else
			echo "Launcher not installed or not found."
			if [[ $(grep -r "$launcher_nickname" "/tmp/regataos-gcs/config/installed-launchers.conf") == *"$launcher_nickname"* ]]; then
				sed -i "s/$launcher_nickname//" "/tmp/regataos-gcs/config/installed-launchers.conf"
				sed -i '/^$/d' "/tmp/regataos-gcs/config/installed-launchers.conf"
			fi
		fi

	else
		echo "Launcher not installed or not found."
		if [[ $(grep -r "$launcher_nickname" "/tmp/regataos-gcs/config/installed-launchers.conf") == *"$launcher_nickname"* ]]; then
			sed -i "s/$launcher_nickname//" "/tmp/regataos-gcs/config/installed-launchers.conf"
			sed -i '/^$/d' "/tmp/regataos-gcs/config/installed-launchers.conf"
		fi
	fi
}

# Get game information and check if they are installed
for i in /opt/regataos-gcs/www/js/js-pages/launchers-list/*.json; do

	launcher_nickname=$(grep -R '"launcher_nickname":' $i | awk '{print $2}' | sed 's/"\|,//g')

	launcher_executable=$(grep -R '"executable_file":' $i | awk '{print $2}' | sed 's/"\|,//g')
	search_in_gcs=$(find "$HOME/Game Access/" -type f -iname "$launcher_executable")
	search_in_wineprefixes=$(find "$HOME/.local/share/wineprefixes/$launcher_nickname-compatibility-mode" -type f -iname "$launcher_executable")

	search_installed_launchers

done
