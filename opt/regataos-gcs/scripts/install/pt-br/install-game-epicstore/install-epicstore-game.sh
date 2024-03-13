#!/bin/bash
#

# Settings and variables
#General information
if [ -z $game_nickname ]; then
	if test -e "/tmp/regataos-gcs/start-installation-epicstore.txt"; then
		export game_nickname="$(cat /tmp/regataos-gcs/start-installation-epicstore.txt)"
		rm -f "/tmp/regataos-gcs/start-installation-epicstore.txt"

	else
		if test -e "/tmp/regataos-gcs/gcs-for-install.txt"; then
			export game_nickname="$(cat /tmp/regataos-gcs/gcs-for-install.txt | head -1 | tail -1)"
			sed -i "/$game_nickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
			sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"
		fi
	fi

else
	if test -e "/tmp/regataos-gcs/start-installation-epicstore.txt"; then
		rm -f "/tmp/regataos-gcs/start-installation-epicstore.txt"
	fi
fi

if test -e "/tmp/regataos-gcs/gcs-for-install.txt"; then
	if test -e "/tmp/regataos-gcs/installing-$game_nickname"; then
		sed -i "/$game_nickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
		sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"
	fi
fi

app_name="$(grep -r "gamename" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_id="$(grep -r "gameid" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_folder="$(grep -r "game_folder" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
app_nickname="epicstore"
app_name_down="Baixando $app_name"
app_name_process="Instalar $app_name"
app_install_status="Instalando $app_name..."
start_process="Iniciando a instalação"
conf_prefix_status="Preparando o modo de compatibilidade..."
success_installation="Concluído!"
success_notify_title="instalado com sucesso!"
success_notify_text="foi instalado com sucesso."
installation_error="Erro!"
error_notify_title="Erro na instalação do"
error_notify_text="Ocorreu algum erro na instalação do"
installation_error_status="Erro na instalação"
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
		mkdir -p "$HOME/Game Access/Epic Games Store"
		GAME_INSTALL_DIR="$HOME/Game Access/Epic Games Store"

	else
		if [[ $(echo $installation_folder) == *"game-access/Epic Games Store"* ]]; then
			install_folder="$(echo $installation_folder | sed 's|/game-access/Epic Games Store||')"

		elif [[ $(echo $installation_folder) == *"game-access"* ]]; then
			install_folder="$(echo $installation_folder | sed 's|/game-access||')"

		else
			install_folder="$(echo $installation_folder)"
		fi

		if test ! -e "$install_folder/game-access/Epic Games Store"; then
			mkdir -p "$install_folder/game-access/Epic Games Store"
		fi

		GAME_INSTALL_DIR=$(echo "$install_folder/game-access/Epic Games Store")

		if test ! -e "$HOME/Game Access/Epic Games Store"; then
			ln -sf "$GAME_INSTALL_DIR" "$HOME/Game Access/"
		fi

		rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"
	fi
}

# Application setup function
function install_app() {
	rm -f "/tmp/regataos-gcs/game-patch-epicstore.txt"
	sed -i "/$game_nickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
	/opt/regataos-gcs/tools/legendary/legendary import "$app_name" "$GAME_INSTALL_DIR/$game_folder" "$(cat /tmp/regataos-gcs/game-patch-epicstore.txt)" 2>&1 | (pv -n >/tmp/regataos-gcs/instalation-legendary)

	# Fix for games
	cp -f "/opt/regataos-gcs/tools/legendary/config.ini" "$HOME/.config/legendary/config.ini"

	# Automatically sync all games with the Epic Games Launcher
	if [[ $(cat /tmp/regataos-gcs/config/installed-launchers.conf) == *"epicstore"* ]]; then
		PREFIX_LOCATION="$HOME/.local/share/wineprefixes/epicstore-compatibility-mode"
		MANIFESTS_DIR="$PREFIX_LOCATION/drive_c/ProgramData/Epic/EpicGamesLauncher/Data/Manifests"

		/opt/regataos-gcs/tools/legendary/legendary -y egl-sync \
		--egl-manifest-path "$MANIFESTS_DIR" \
		--egl-wine-prefix "$PREFIX_LOCATION"

		# Fix the game install location in the Manifest file for the Epic Games Store.
		checkFiles="$(ls $MANIFESTS_DIR | grep .item)"
		if [[ $checkFiles == *".item"* ]]; then
			for manifest in $checkFiles; do
				checkInstallLocation=$(cat "$MANIFESTS_DIR/$manifest" | grep InstallLocation | cut -d':' -f 2- | sed 's/ "//' | sed 's/",//')

				if [[ $checkInstallLocation != *"Z:\\"* ]]; then
					echo -e 'Fix Manifest the "'"$manifest"'" file to show the game in Epic Games Store launcher.\n'
					echo -e "Old install path: $checkInstallLocation\n"

					oldInstallPath=$(cat "$MANIFESTS_DIR/$manifest" | grep InstallLocation | cut -d':' -f 2- | sed "s/ //" | sed 's/",//')
					newInstallPathShow=$(echo "$oldInstallPath" | sed 's|"\/|Z:\\\\|g' | sed 's|\/|\\\\|g')
					echo "New install path: $newInstallPathShow"

					newInstallPath=$(echo "$oldInstallPath" | sed 's|"\/|Z:\\\\\\\\|g' | sed 's|\/|\\\\\\\\|g')
					sed -i "s|$oldInstallPath|$newInstallPath|g" "$MANIFESTS_DIR/$manifest"
				fi
			done
		fi
	fi
}

# Successful installation
function success_installation() {
	cp -f "$HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json" "$HOME/.config/regataos-gcs/installed/$game_nickname-epicstore.json"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$app_name $success_notify_title"

	# Check UI status
	echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games-epic.txt"
	echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games.txt"
	echo "rearrange game blocks" >"/tmp/regataos-gcs/config/file-status.txt"
	sleep 2
	echo "rearrange game blocks" >"/tmp/regataos-gcs/config/file-status.txt"
}

# Installation failed
function installation_failed() {
	rm -f "$HOME/.config/regataos-gcs/installed/$game_nickname-epicstore.json"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$error_notify_title $app_name!" "$error_notify_text $app_name."
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

			if [[ $(echo $GAME_INSTALL_DIR) != *"$HOME/Game Access/Epic Games Store"* ]]; then
				echo "$GAME_INSTALL_DIR" >"/tmp/regataos-gcs/$game_nickname-installdir.txt"
			fi

			echo "$game_nickname=epicstore process-$app_name_process" >>$progressbar_dir/queued-process
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

				if [[ $(echo $GAME_INSTALL_DIR) != *"$HOME/Game Access/Epic Games Store"* ]]; then
					echo "$GAME_INSTALL_DIR" >"/tmp/regataos-gcs/$game_nickname-installdir.txt"
				fi

				echo "$game_nickname=epicstore process-$app_name_process" >>$progressbar_dir/queued-process
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

killall install-epicstore-game.sh
pkill --signal CONT legendary
killall legendary

if test ! -e $progressbar_dir/queued-1 ; then
	rm -f $progressbar_dir/*
fi

echo "0%" > $progressbar_dir/progress
rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"
sed -i "/$game_nickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

rm -f $progressbar_dir/app-name
rm -f $progressbar_dir/download-percentage-legendary
rm -f $progressbar_dir/get-pid
rm -f $progressbar_dir/installing
rm -f "/tmp/regataos-gcs/installing-$app_nickname"
rm -f "/tmp/regataos-gcs/installing-$game_nickname"
rm -f $progressbar_dir/down-paused
rm -f $progressbar_dir/script-cancel
rm -f "/tmp/regataos-gcs/instalation-legendary"
rm -f "/tmp/regataos-gcs/game-patch-epicstore.txt"
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
	echo "legendary" >$progressbar_dir/legendary-pid

	# Prepare installation directory 
	create_installation_directory

	if test -e "$GAME_INSTALL_DIR/$game_folder/.egstore"; then
		/opt/regataos-gcs/tools/legendary/legendary -y install --repair "$game_id" --base-path "$GAME_INSTALL_DIR/" 2>&1 | (pv -n >$progressbar_dir/download-percentage-legendary)
	else
		/opt/regataos-gcs/tools/legendary/legendary -y install --download-only "$game_id" --base-path "$GAME_INSTALL_DIR/" 2>&1 | (pv -n >$progressbar_dir/download-percentage-legendary)
	fi

	/opt/regataos-gcs/tools/legendary/legendary -y activate --uplay "$game_id"
	/opt/regataos-gcs/tools/legendary/legendary -y activate --origin "$game_id"

	echo 100% >$progressbar_dir/progress
	sleep 3
	rm -f $progressbar_dir/download-percentage-legendary
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
	if [[ $(cat /tmp/regataos-gcs/instalation-legendary) == *"has been imported"* ]]; then
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
		rm -f "/tmp/regataos-gcs/instalation-legendary"
		#rm -f "/tmp/regataos-gcs/game-patch-epicstore.txt"
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
		rm -f "/tmp/regataos-gcs/instalation-legendary"
		#rm -f "/tmp/regataos-gcs/game-patch-epicstore.txt"
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
if [[ $(ps aux | egrep "install-epicstore-game.sh") == *"install-epicstore-game.sh start"* ]]; then
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
