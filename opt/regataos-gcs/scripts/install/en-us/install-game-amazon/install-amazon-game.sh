#!/bin/bash
#

# Download compatibility mode
if test ! -e "/opt/wine-gcs/bin/wine"; then
	/opt/regataos-gcs/scripts/install/scripts-install/download-wine-gcs.sh start
fi

# Settings and variables
#General information
if [ -z $game_nickname ]; then
	if test -e "/tmp/regataos-gcs/start-installation-amazon.txt"; then
		export game_nickname="$(cat /tmp/regataos-gcs/start-installation-amazon.txt)"
		rm -f "/tmp/regataos-gcs/start-installation-amazon.txt"

	else
		if test -e "/tmp/regataos-gcs/gcs-for-install.txt"; then
			export game_nickname="$(cat /tmp/regataos-gcs/gcs-for-install.txt | head -1 | tail -1)"
			sed -i "/$game_nickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
			sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"
		fi
	fi

else
	if test -e "/tmp/regataos-gcs/start-installation-amazon.txt"; then
		rm -f "/tmp/regataos-gcs/start-installation-amazon.txt"
	fi
fi

if test -e "/tmp/regataos-gcs/gcs-for-install.txt"; then
	if test -e "/tmp/regataos-gcs/installing-$game_nickname"; then
		sed -i "/$game_nickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
		sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"
	fi
fi

app_name="$(grep -r "gamename" $HOME/.config/regataos-gcs/amazon-games/json/$game_nickname-amazon.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_id="$(grep -r "gameid" $HOME/.config/regataos-gcs/amazon-games/json/$game_nickname-amazon.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_folder="$(grep -r "game_folder" $HOME/.config/regataos-gcs/amazon-games/json/$game_nickname-amazon.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
app_nickname="amazon"
app_name_down="Downloading $app_name"
app_name_process="Install $app_name"
app_install_status="Installing $app_name..."
start_process="Starting installation"
conf_prefix_status="Preparing compatibility mode..."
success_installation="Concluded!"
success_notify_title="successfully installed!"
success_notify_text="has been successfully installed."
installation_error="Error!"
error_notify_title="installation error!"
error_notify_text="There was an error installing"
installation_error_status="Installation error"
progressbar_dir="/tmp/progressbar-gcs"
user=$(users | awk '{print $1}')

# Check the game's installation folder
function create_installation_directory() {
	if test -e "/tmp/regataos-gcs/$game_nickname-installdir.txt"; then
		custom_game_folder=$(cat "/tmp/regataos-gcs/$game_nickname-installdir.txt")
	else
		custom_game_folder=""
	fi

	if [ ! -z "$custom_game_folder" ]; then
		installation_folder=$(cat "/tmp/regataos-gcs/$game_nickname-installdir.txt")

	else
		if [ ! -z "$GAME_PATH" ]; then
			installation_folder=$(echo "$GAME_PATH")

		else
			if test -e "/tmp/regataos-gcs/config/external-games-folder.txt"; then
				installation_folder="$(cat /tmp/regataos-gcs/config/external-games-folder.txt)"

			else
				installation_folder=""
			fi
		fi
	fi

	if [ -z "$installation_folder" ]; then
		mkdir -p "$HOME/Game Access/Amazon Games"
		GAME_INSTALL_DIR="$HOME/Game Access/Amazon Games"

	else
		if [[ $(echo $installation_folder) == *"game-access/Amazon Games"* ]]; then
			install_folder="$(echo $installation_folder | sed 's|/game-access/Amazon Games||')"

		elif [[ $(echo $installation_folder) == *"game-access"* ]]; then
			install_folder="$(echo $installation_folder | sed 's|/game-access||')"

		else
			install_folder="$(echo $installation_folder)"
		fi

		if test ! -e "$install_folder/game-access/Amazon Games"; then
			mkdir -p "$install_folder/game-access/Amazon Games"
		fi

		GAME_INSTALL_DIR=$(echo "$install_folder/game-access/Amazon Games")

		if test ! -e "$HOME/Game Access/Amazon Games"; then
			ln -sf "$GAME_INSTALL_DIR" "$HOME/Game Access/"
		fi

		rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"
	fi
}

# Application setup function
function install_app() {
	rm -f "/tmp/regataos-gcs/game-patch-amazon.txt"
	sed -i "/$game_nickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
	/opt/regataos-gcs/tools/nile/nile import "$game_id" --path "$GAME_INSTALL_DIR/$game_folder" 2>&1 | (pv -n >/tmp/regataos-gcs/instalation-nile)
}

# Successful installation
function success_installation() {
	cp -f "$HOME/.config/regataos-gcs/amazon-games/json/$game_nickname-amazon.json" \
	"$HOME/.config/regataos-gcs/installed/$game_nickname-amazon.json"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$app_name $success_notify_title"

	# Check UI status
	echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games-amazon.txt"
	echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games.txt"
	echo "rearrange game blocks" >"/tmp/regataos-gcs/config/file-status.txt"
	sleep 2
	echo "rearrange game blocks" >"/tmp/regataos-gcs/config/file-status.txt"
}

# Installation failed
function installation_failed() {
	rm -f "$HOME/.config/regataos-gcs/installed/$game_nickname-amazon.json"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$app_name $error_notify_title" "$error_notify_text $app_name."
}

# Search for processes
if test -e "$progressbar_dir/installing"; then
	if test ! -e "/tmp/regataos-gcs/installing-$game_nickname"; then
		# Put the process in the installation queue
		kmsg=$(grep -r $game_nickname $progressbar_dir/queued-process)
		if [[ $kmsg == *"$game_nickname"* ]]; then
			echo "Nothing to do."

		else
			echo "$game_nickname" >>"/tmp/regataos-gcs/gcs-for-install.txt"
			sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

			if [[ $(echo $GAME_INSTALL_DIR) != *"$HOME/Game Access/Amazon Games"* ]]; then
				echo "$GAME_INSTALL_DIR" >"/tmp/regataos-gcs/$game_nickname-installdir.txt"
			fi

			echo "$game_nickname=amazon process-$app_name_process" >>$progressbar_dir/queued-process
		fi

		#I'm in the process queue, see you later
		exit 0

	else
		#I'm in the process queue, see you later
		echo "Installation in progress..."
		exit 0
	fi

else
	# Start dependences Download
	if test ! -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz"; then
		if test ! -e "$HOME/.cache/winetricks/directx9/directx_Jun2010_redist.exe"; then
			# Put the process in the installation queue
			kmsg=$(grep -r $game_nickname $progressbar_dir/queued-process)
			if [[ $kmsg == *"$game_nickname"* ]]; then
				echo "Nothing to do."
			else
				echo "$game_nickname" >>"/tmp/regataos-gcs/gcs-for-install.txt"
				sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

				if [[ $(echo $GAME_INSTALL_DIR) != *"$HOME/Game Access/Amazon Games"* ]]; then
					echo "$GAME_INSTALL_DIR" >"/tmp/regataos-gcs/$game_nickname-installdir.txt"
				fi

				echo "$game_nickname=amazon process-$app_name_process" >>$progressbar_dir/queued-process
			fi

			echo dotnet >/tmp/regataos-gcs/dotnet
			/opt/regataos-gcs/scripts/install/scripts-install/directx-compatibility-mode.sh start

			#I'm in the process queue, see you later
			exit 0
		fi
	fi
fi

# If Vulkan is supported, enable DXVK and VKD3D-Proton
function enable_dxvk_vkd3d() {
	export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode"
	/bin/bash /opt/regataos-gcs/scripts/action-games/configure-compatibility-mode -configure-dxvk-vkd3d
}

# Create wineprefix in external directory
function wineprefix_external() {
	if [[ $(echo $external_directory_file) != *"game-access"* ]]; then
		mkdir -p "$(echo $external_directory_file)/game-access"
		external_directory="$(echo $external_directory_file)/game-access"

	else
		external_directory="$(echo $external_directory_file)"
	fi

	if test ! -e "$(echo $external_directory)/wineprefixes-gcs"; then
		mkdir -p "$(echo $external_directory)/wineprefixes-gcs"
	fi

	if test ! -e "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode/system.reg"; then
		mkdir -p "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode"

		cp -rf $HOME/.local/share/wineprefixes/default-compatibility-mode/* \
			"$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode/"
	fi

	rm -rf "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
	ln -sf "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode" \
		"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
}

# Create wineprefix in user home
function wineprefix_home() {
	if test ! -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/system.reg"; then
		mkdir -p "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

		cp -rf $HOME/.local/share/wineprefixes/default-compatibility-mode/* \
			"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/"
	fi
}

# Start installation
function start_installation() {

	# Create cancel script
	rm -f $progressbar_dir/script-cancel
	cat >$progressbar_dir/script-cancel <<EOM
#!/bin/bash 
#

killall install-amazon-game.sh
pkill --signal CONT nile
killall nile

if test ! -e $progressbar_dir/queued-1 ; then
	rm -f $progressbar_dir/*
fi

echo "0%" > $progressbar_dir/progress
rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"
sed -i "/$game_nickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

rm -f $progressbar_dir/app-name
rm -f $progressbar_dir/download-percentage-nile
rm -f $progressbar_dir/get-pid
rm -f $progressbar_dir/installing
rm -f "/tmp/regataos-gcs/installing-$app_nickname"
rm -f "/tmp/regataos-gcs/installing-$game_nickname"
rm -f $progressbar_dir/down-paused
rm -f $progressbar_dir/script-cancel
rm -f "/tmp/regataos-gcs/instalation-nile"
rm -f "/tmp/regataos-gcs/game-patch-amazon.txt"
rm -rf "$GAME_INSTALL_DIR/$game_folder"
EOM

	chmod +x $progressbar_dir/script-cancel

	# Prepare the progress bar and downloading
	rm -f $progressbar_dir/progress-movement
	echo "installing" >$progressbar_dir/installing
	echo "installing" >/tmp/regataos-gcs/installing-$app_nickname
	echo "installing" >/tmp/regataos-gcs/installing-$game_nickname
	echo $app_name_down >$progressbar_dir/app-name
	echo "0%" >$progressbar_dir/progress
	echo $app_download_status >$progressbar_dir/status
	sleep 1
	echo "show progress bar" >$progressbar_dir/progressbar
	echo "nile" >$progressbar_dir/nile-pid

	# Prepare installation directory 
	create_installation_directory

	/opt/regataos-gcs/tools/nile/nile install "$game_id" --base-path "$GAME_INSTALL_DIR/" --info 2>&1 | (pv -n >$progressbar_dir/download-percentage-nile)

	echo 100% >$progressbar_dir/progress
	sleep 3
	rm -f $progressbar_dir/download-percentage-nile
	rm -f $progressbar_dir/speed
	rm -f $progressbar_dir/download-download-size
	rm -f $progressbar_dir/download-speed
	rm -f $progressbar_dir/file-size
	rm -f $progressbar_dir/eta

	# Prepare wineprefix to run the launcher and games
	if test -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/system.reg"; then
		if test ! -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/system.reg"; then
			# Configuring compatibility mode
			echo "installing" >$progressbar_dir/progress-movement
			echo "" >$progressbar_dir/progress
			echo $app_name >$progressbar_dir/app-name
			echo $conf_prefix_status >$progressbar_dir/status
			sleep 1
			echo "show progress bar" >$progressbar_dir/progressbar

			# Enable DXVK and VKD3D-Proton
			if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
				enable_dxvk_vkd3d
			fi
		fi

	elif test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz"; then
		if test ! -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/system.reg"; then
			# Configuring compatibility mode
			echo "installing" >$progressbar_dir/progress-movement
			echo "" >$progressbar_dir/progress
			echo $app_name >$progressbar_dir/app-name
			echo $conf_prefix_status >$progressbar_dir/status
			sleep 1
			echo "show progress bar" >$progressbar_dir/progressbar

			if test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz"; then
				tar xf "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" -C "$HOME/.local/share/wineprefixes/"
			fi

			# Enable DXVK and VKD3D-Proton
			if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
				enable_dxvk_vkd3d
			fi
		fi

	else
		# Configuring compatibility mode
		echo "installing" >$progressbar_dir/progress-movement
		echo "" >$progressbar_dir/progress
		echo $app_name >$progressbar_dir/app-name
		echo $conf_prefix_status >$progressbar_dir/status
		sleep 1
		echo "show progress bar" >$progressbar_dir/progressbar

		/opt/regataos-gcs/scripts/prepare-default-compatibility-mode.sh start

		# Enable DXVK and VKD3D-Proton
		if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
			enable_dxvk_vkd3d
		fi
	fi

	# Prepare to copy launcher wineprefix
	if test -e "$HOME/.config/regataos-gcs/external-games-folder.txt"; then
        external_directory_file="$(cat "$HOME/.config/regataos-gcs/external-games-folder.txt")"

		# Check the file system of the external directory where games and wineprefix will be installed.
		# If the file system is different from ext4 or btrfs, create the wineprefix in the user's home.
		check_file_system=$(findmnt -n -o FSTYPE -T $external_directory_file)

		if [[ $(echo $check_file_system) == *"ext4"* ]] || [[ $(echo $check_file_system) == *"btrfs"* ]]; then
			wineprefix_external
		else
			wineprefix_home
		fi

	else
		wineprefix_home
	fi

	# Remove cancel script
	rm -f $progressbar_dir/script-cancel

	# Install app
	echo $app_install_status >$progressbar_dir/status
	echo "" >$progressbar_dir/progress
	echo "installing" >$progressbar_dir/progress-movement
	install_app

	# Confirm installation
	if [[ $(cat /tmp/regataos-gcs/instalation-nile) == *"has been imported"* ]]; then
		rm -f $progressbar_dir/progress-movement
		echo "completed" >$progressbar_dir/progress-full
		echo "" >$progressbar_dir/status
		echo $success_installation >$progressbar_dir/progress
		success_installation
		sleep 2
		rm -f $progressbar_dir/progress-full
		rm -f $progressbar_dir/installing
		rm -f /tmp/regataos-gcs/installing-$app_nickname
		rm -f "/tmp/regataos-gcs/installing-$game_nickname"
		rm -f "/tmp/regataos-gcs/$app_download_file_name"
		rm -f "/tmp/regataos-gcs/instalation-nile"
		#rm -f "/tmp/regataos-gcs/game-patch-amazon.txt"
		rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"
		sed -i "/$game_nickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
		sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1"; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi
	else
		rm -f $progressbar_dir/progress-movement
		rm -f $progressbar_dir/progress-full
		echo $installation_error >$progressbar_dir/progress
		echo $installation_error_status >$progressbar_dir/status
		installation_failed
		sleep 2
		rm -f $progressbar_dir/installing
		rm -f /tmp/regataos-gcs/installing-$app_nickname
		rm -f "/tmp/regataos-gcs/installing-$game_nickname"
		rm -f "/tmp/regataos-gcs/$app_download_file_name"
		rm -f "/tmp/regataos-gcs/instalation-nile"
		#rm -f "/tmp/regataos-gcs/game-patch-amazon.txt"
		rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"
		sed -i "/$game_nickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
		sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1"; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi
	fi
}

# Verify that the installation is already in place.
if [[ $(ps aux | egrep "install-amazon-game.sh") == *"install-amazon-game.sh start"* ]]; then
	if test -e "$progressbar_dir/download-extra.txt"; then
		rm -f "$progressbar_dir/download-extra.txt"
		start_installation
	else
		if test -e "$progressbar_dir/installing"; then
			echo "Installation in progress..."
		else
			start_installation
		fi
	fi
else
	start_installation
fi
