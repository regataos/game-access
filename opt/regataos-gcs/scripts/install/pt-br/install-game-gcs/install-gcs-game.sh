#!/bin/bash 
#

# Settings and variables
if [ -z $gameNickname ];then
	if test -e "/tmp/regataos-gcs/start-installation-gcs.txt"; then
		export gameNickname="$(cat /tmp/regataos-gcs/start-installation-gcs.txt)"
		rm -f "/tmp/regataos-gcs/start-installation-gcs.txt"

	else
		if test -e "/tmp/regataos-gcs/gcs-for-install.txt"; then
			export gameNickname="$(cat /tmp/regataos-gcs/gcs-for-install.txt | head -1 | tail -1)"
			sed -i "/$gameNickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
			sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"
		fi
	fi
fi

user=$(users | awk '{print $1}')
game_name="$(grep -r "gamename" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_folder="$(grep -r "gamefolder" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_nickname="$(grep -r "gamenickname" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_download="$(grep -r "gamedownload_link" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_download_file_name="$(grep -r "gamedownload_file_name" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
install_args="$(grep -r "install_args" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
file_executable="$(grep -r "file_executable" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g' | sed "s/username/$user/")"
game_plataform="$(grep -r "plataform" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
custom_runtime="$(grep -r "custom_runtime" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
custom_runtime_download="$(grep -r "custom_runtime_download" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
custom_runtime_file="$(grep -r "custom_runtime_file" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
custom_runtime_name="$(grep -r "custom_runtime_name" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_name_down="Baixando $game_name..."
game_runtime_down="Baixando runtime customizado..."
game_name_process="Instalar $game_name"
game_install_status="Instalando $game_name..."
start_process="Iniciando a instala????o"
conf_prefix_status="Preparando o modo de compatibilidade..."
success_installation="Conclu??do"
success_notify_title="instalado com sucesso!"
success_notify_text="foi instalado com sucesso."
installation_error="Erro"
error_notify_title="Erro na instala????o do"
error_notify_text="Ocorreu algum erro na instala????o do"
installation_error_status="Erro na instala????o"
progressbar_dir="/tmp/progressbar-gcs"

# Check the game's installation folder
GAME_INSTALL_DIR="$GAME_PATH"

if test -e "/tmp/regataos-gcs/$game_nickname-installdir.txt"; then
	GAME_INSTALL_DIR="$(cat /tmp/regataos-gcs/$game_nickname-installdir.txt)"
	GAME_PATH="$GAME_INSTALL_DIR"
	rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"

	if test ! -e "$GAME_INSTALL_DIR/game-access"; then
		mkdir -p "$GAME_INSTALL_DIR/game-access"
	fi

elif [ ! -z "$GAME_INSTALL_DIR" ] ;then
	if [[ $(echo $GAME_INSTALL_DIR) == *"game-access"* ]]; then
		GAME_INSTALL_DIR="$(echo $GAME_INSTALL_DIR | sed 's/game-access//')"
	else
		if test ! -e "$GAME_INSTALL_DIR/game-access"; then
			mkdir -p "$GAME_INSTALL_DIR/game-access"
		fi
	fi

else
	if test ! -e "$HOME/Game Access"; then
		mkdir -p "$HOME/Game Access"
	fi

	GAME_INSTALL_DIR="$HOME/Game Access"
fi

#Default settings
game_nickname_dir="$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode"

# Application setup function
function install_app() {
	if [[ $(echo $game_plataform) == *"windows"* ]]; then
		export WINEDEBUG=-all
		export WINEDLLOVERRIDES="mscoree,mshtml,winemenubuilder,winedbg="
		export WINEPREFIX="$game_nickname_dir"

		if [ ! -z "$GAME_PATH" ] ;then
			mkdir -p "$GAME_INSTALL_DIR/game-access/$game_folder"

			mv -fv "$game_nickname_dir/drive_c" "$GAME_INSTALL_DIR/game-access/$game_folder/"
			mv -fv "$game_nickname_dir/system.reg" "$GAME_INSTALL_DIR/game-access/$game_folder/"
			mv -fv "$game_nickname_dir/user.reg" "$GAME_INSTALL_DIR/game-access/$game_folder/"
			mv -fv "$game_nickname_dir/userdef.reg" "$GAME_INSTALL_DIR/game-access/$game_folder/"

			ln -sfv "$GAME_INSTALL_DIR/game-access/$game_folder/drive_c" "$game_nickname_dir/"
			ln -sfv "$GAME_INSTALL_DIR/game-access/$game_folder/system.reg" "$game_nickname_dir/"
			ln -sfv "$GAME_INSTALL_DIR/game-access/$game_folder/user.reg" "$game_nickname_dir/"
			ln -sfv "$GAME_INSTALL_DIR/game-access/$game_folder/userdef.reg" "$game_nickname_dir/"
		fi

		if [[ $(echo $custom_runtime) == *"true"* ]]; then
			# Variables for custom Wine
			export CUSTOM_WINE_DIR="$(cat $HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt)"

			export WINEDLLPATH="$CUSTOM_WINE_DIR/lib:$CUSTOM_WINE_DIR/lib64"
			export WINESERVER="$CUSTOM_WINE_DIR/bin/wineserver"
			export WINELOADER="$CUSTOM_WINE_DIR/bin/wine"
			export WINE="$CUSTOM_WINE_DIR/bin/wine"

			alias wine="$CUSTOM_WINE_DIR/bin/wine"
			alias wine64="$CUSTOM_WINE_DIR/bin/wine64"
			alias wineserver="$CUSTOM_WINE_DIR/bin/wineserver"
			alias wineboot="$CUSTOM_WINE_DIR/bin/wineboot"
			alias winecfg="$CUSTOM_WINE_DIR/bin/winecfg"
			alias msiexec="$CUSTOM_WINE_DIR/bin/msiexec"

			# Alternative fix for LoL
			if [[ $(echo $game_nickname) == *"lol"* ]]; then
    			pkexec sh -c 'sysctl -w abi.vsyscall32=0'
				/opt/regataos-gcs/scripts/action-games/launch-helper-lol.sh start &
			fi

			if [[ $(echo $game_download_file_name) == *".exe"* ]]; then
				$CUSTOM_WINE_DIR/bin/wine /tmp/regataos-gcs/$game_download_file_name $install_args
			else
				$CUSTOM_WINE_DIR/bin/wine $CUSTOM_WINE_DIR/bin/msiexec /i /tmp/regataos-gcs/$game_download_file_name $install_args
			fi

		else
			if [[ $(echo $game_download_file_name) == *".exe"* ]]; then
				wine /tmp/regataos-gcs/$game_download_file_name $install_args
			else
				wine msiexec /i /tmp/regataos-gcs/$game_download_file_name $install_args
			fi
		fi

	else
		if [[ $(echo $game_download_file_name) == *".zip"* ]]; then
			if [ -z "$GAME_PATH" ] ;then
				unzip -u "/tmp/regataos-gcs/$game_download_file_name" -d "$GAME_INSTALL_DIR/"
			else
				unzip -u "/tmp/regataos-gcs/$game_download_file_name" -d "$GAME_INSTALL_DIR/game-access/"
			fi
		fi
	fi
}

# Successful installation
function success_installation() {
    cp -f "/opt/regataos-gcs/games-list/$game_nickname.json" "$HOME/.config/regataos-gcs/installed/$game_nickname.json"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$game_name $success_notify_title" "$game_name $success_notify_text"
}

# Installation failed
function installation_failed() {
	rm -f "$HOME/.config/regataos-gcs/installed/$game_nickname.json"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$error_notify_title $game_name!" "$error_notify_text $game_name."
}

# Search for processes
if test -e "$progressbar_dir/installing" ; then
	if test ! -e "/tmp/regataos-gcs/installing-$game_nickname"; then
		# Put the process in the installation queue
		kmsg=$(grep -r $game_nickname $progressbar_dir/queued-process)
		if [[ $kmsg == *"$game_nickname"* ]]; then
			echo "Nothing to do."
		else
			echo "$game_nickname" >> "/tmp/regataos-gcs/gcs-for-install.txt"
			sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

			if [[ $(echo $GAME_INSTALL_DIR) != *"$HOME/Game Access"* ]]; then
				echo "$GAME_INSTALL_DIR" > "/tmp/regataos-gcs/$game_nickname-installdir.txt"
			fi

			echo "$game_nickname=gcs process-$game_name_process" >> $progressbar_dir/queued-process
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
	if [[ $(echo $game_plataform) == *"windows"* ]]; then
		if test ! -e "$HOME/.cache/winetricks/directx9/directx_Jun2010_redist.exe"; then
			# Put the process in the installation queue
			kmsg=$(grep -r $game_nickname $progressbar_dir/queued-process)
			if [[ $kmsg == *"$game_nickname"* ]]; then
				echo "Nothing to do."
			else
				echo "$game_nickname" >> "/tmp/regataos-gcs/gcs-for-install.txt"
				sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

				echo "$game_nickname=gcs process-$game_name_process" >> $progressbar_dir/queued-process
			fi

			echo dotnet > /tmp/regataos-gcs/dotnet
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

# Start installation
function start_installation() {
	# Create cancel script
	rm -f $progressbar_dir/script-cancel
	cat > $progressbar_dir/script-cancel << EOM
	#!/bin/bash 
	#

	killall install-gcs-game.sh
	killall winetricks
	rm -rf "$game_nickname_dir"
	rm -rf "$HOME/.config/regataos-gcs/custom-runtime/$custom_runtime_name"
	rm -f "$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"
	rm -f "/tmp/regataos-gcs/$game_download_file_name"
	rm -f "/tmp/regataos-gcs/$custom_runtime_file"
	sed -i "/$gameNickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
	sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

	if test ! -e $progressbar_dir/queued-1 ; then
		rm -f $progressbar_dir/*
	fi

	echo "0%" > $progressbar_dir/progress
	rm -f $progressbar_dir/get-pid
	rm -f $progressbar_dir/installing
	rm -f "/tmp/regataos-gcs/installing-$game_nickname"
	rm -f $progressbar_dir/down-paused
	rm -f $progressbar_dir/script-cancel
EOM

	chmod +x $progressbar_dir/script-cancel

	# Prepare the progress bar and downloading custom runtime
	if [[ $(echo $custom_runtime) == *"true"* ]]; then
		if test ! -e "$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"; then
			rm -f $progressbar_dir/progress-movement
			echo "installing" > $progressbar_dir/installing
			echo "installing" > /tmp/regataos-gcs/installing-$game_nickname
			echo $game_name > $progressbar_dir/app-name
			echo "0%" > $progressbar_dir/progress
			echo "$game_runtime_down" > $progressbar_dir/status
			sleep 1
			echo "show progress bar" > $progressbar_dir/progressbar

			# Download
			echo "/tmp/regataos-gcs/$custom_runtime_file" > $progressbar_dir/file-download-size
			echo "wget --no-check-certificate -O /tmp/regataos-gcs/$custom_runtime_file $custom_runtime_download" > $progressbar_dir/get-pid
			wget --no-check-certificate -O "/tmp/regataos-gcs/$custom_runtime_file" "$custom_runtime_download" 2>&1 | (pv -n > $progressbar_dir/download-percentage)
			echo 100% > $progressbar_dir/progress
			sleep 3
			rm -f $progressbar_dir/download-percentage
			rm -f $progressbar_dir/download-size
			rm -f $progressbar_dir/download-speed
			rm -f $progressbar_dir/file-size
			rm -f $progressbar_dir/eta
		fi
	fi

	# Prepare the progress bar and downloading
	rm -f $progressbar_dir/progress-movement
	echo "installing" > $progressbar_dir/installing
	echo "installing" > /tmp/regataos-gcs/installing-$game_nickname
	echo $game_name > $progressbar_dir/app-name
	echo "0%" > $progressbar_dir/progress
	echo "$game_name_down" > $progressbar_dir/status
	sleep 1
	echo "show progress bar" > $progressbar_dir/progressbar

	# Download
	echo "/tmp/regataos-gcs/$game_download_file_name" > $progressbar_dir/file-download-size
	echo "wget --no-check-certificate -O /tmp/regataos-gcs/$game_download_file_name $game_download" > $progressbar_dir/get-pid
	wget --no-check-certificate -O "/tmp/regataos-gcs/$game_download_file_name" "$game_download" 2>&1 | (pv -n > $progressbar_dir/download-percentage)
	echo 100% > $progressbar_dir/progress
	sleep 3
	rm -f $progressbar_dir/download-percentage
	rm -f $progressbar_dir/download-size
	rm -f $progressbar_dir/download-speed
	rm -f $progressbar_dir/file-size
	rm -f $progressbar_dir/eta

	# Prepare wineprefix to run the launcher and games
	if [[ $(echo $game_plataform) == *"windows"* ]]; then
		# For custom runtime
		if [[ $(echo $custom_runtime) == *"true"* ]]; then
			# Prepare custom runtime
			if test ! -e "$HOME/.config/regataos-gcs/custom-runtime/$custom_runtime_name"; then
				mkdir -p "$HOME/.config/regataos-gcs/custom-runtime"

				if [[ $(echo $custom_runtime_file) == *".tar.xz"* ]]; then
					tar xf "/tmp/regataos-gcs/$custom_runtime_file" -C "$HOME/.config/regataos-gcs/custom-runtime/"
				fi

				echo "$HOME/.config/regataos-gcs/custom-runtime/$custom_runtime_name" > "$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"
				rm -f "/tmp/regataos-gcs/$custom_runtime_file"
			fi

			/opt/regataos-gcs/scripts/install/scripts-install/install-game-gcs/prepare-compatibility-mode -lcm $game_nickname

		else
			# For default runtime
			if test -e "$HOME/.local/share/wineprefixes/default-compatibility-mode"; then
				if test ! -e "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode"; then
					# Configuring compatibility mode
					echo "installing" > $progressbar_dir/progress-movement
					echo "" > $progressbar_dir/progress
					echo $game_name > $progressbar_dir/app-name
					echo $conf_prefix_status > $progressbar_dir/status
					sleep 1
					echo "show progress bar" > $progressbar_dir/progressbar

					# Enable DXVK and VKD3D-Proton
					if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
						enable_dxvk_vkd3d
					fi

					cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
					"$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode"
				fi

			elif test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz"; then
				if test ! -e "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode"; then
					# Configuring compatibility mode
					echo "installing" > $progressbar_dir/progress-movement
					echo "" > $progressbar_dir/progress
					echo $game_name > $progressbar_dir/app-name
					echo $conf_prefix_status > $progressbar_dir/status
					sleep 1
					echo "show progress bar" > $progressbar_dir/progressbar

					if test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz"; then
						tar xf "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" -C "$HOME/.local/share/wineprefixes/"
					fi

					# Enable DXVK and VKD3D-Proton
					if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
						enable_dxvk_vkd3d
					fi

					cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
					"$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode"
				fi

			else
				# Configuring compatibility mode
				echo "installing" > $progressbar_dir/progress-movement
				echo "" > $progressbar_dir/progress
				echo $game_name > $progressbar_dir/app-name
				echo $conf_prefix_status > $progressbar_dir/status
				sleep 1
				echo "show progress bar" > $progressbar_dir/progressbar

				/opt/regataos-gcs/scripts/install/scripts-install/install-game-gcs/prepare-compatibility-mode -dcm $game_nickname

				# Enable DXVK and VKD3D-Proton
				if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
					enable_dxvk_vkd3d
				fi

				cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
				"$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode"
			fi
		fi
	fi

	# Remove cancel script
	rm -f $progressbar_dir/script-cancel

	# Install app
	echo $game_install_status > $progressbar_dir/status
	echo "" > $progressbar_dir/progress
	echo "installing" > $progressbar_dir/progress-movement
	echo "show progress bar" > $progressbar_dir/progressbar
	install_app

	# Confirm installation
	if test -e "$GAME_INSTALL_DIR/$game_folder/$file_executable"; then
		rm -f $progressbar_dir/progress-movement
		echo "completed" > $progressbar_dir/progress-full
		echo "" > $progressbar_dir/status
		echo $success_installation > $progressbar_dir/progress
		echo "show installed games" > "/tmp/regataos-gcs/config/installed/show-installed-games-gcs.txt"
		success_installation
		sleep 2
		rm -f $progressbar_dir/progress-full
		rm -f $progressbar_dir/installing
		rm -f /tmp/regataos-gcs/installing-$game_nickname
		rm -f "/tmp/regataos-gcs/$game_download_file_name"

		if [ ! -z "$GAME_PATH" ] ;then
			echo "nickname=$game_nickname" > "$GAME_INSTALL_DIR/game-access/$game_folder/gcs-game.conf"
			echo "installdir=$GAME_INSTALL_DIR/game-access/$game_folder" >> "$GAME_INSTALL_DIR/game-access/$game_folder/gcs-game.conf"
			ln -sf "$GAME_INSTALL_DIR/game-access/$game_folder" "$HOME/Game Access/"
		fi

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1" ; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi

	elif test -e "$GAME_INSTALL_DIR/game-access/$game_folder/$file_executable"; then
		rm -f $progressbar_dir/progress-movement
		echo "completed" > $progressbar_dir/progress-full
		echo "" > $progressbar_dir/status
		echo $success_installation > $progressbar_dir/progress
		echo "show installed games" > "/tmp/regataos-gcs/config/installed/show-installed-games-gcs.txt"
		success_installation
		sleep 2
		rm -f $progressbar_dir/progress-full
		rm -f $progressbar_dir/installing
		rm -f /tmp/regataos-gcs/installing-$game_nickname
		rm -f "/tmp/regataos-gcs/$game_download_file_name"

		if [ ! -z "$GAME_PATH" ] ;then
			echo "nickname=$game_nickname" > "$GAME_INSTALL_DIR/game-access/$game_folder/gcs-game.conf"
			echo "installdir=$GAME_INSTALL_DIR/game-access/$game_folder" >> "$GAME_INSTALL_DIR/game-access/$game_folder/gcs-game.conf"
			ln -sf "$GAME_INSTALL_DIR/game-access/$game_folder" "$HOME/Game Access/"
		fi

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1" ; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi

	elif test -e "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode/$file_executable"; then
		rm -f $progressbar_dir/progress-movement
		echo "completed" > $progressbar_dir/progress-full
		echo "" > $progressbar_dir/status
		echo $success_installation > $progressbar_dir/progress
		echo "show installed games" > "/tmp/regataos-gcs/config/installed/show-installed-games-gcs.txt"
		success_installation
		sleep 2
		rm -f $progressbar_dir/progress-full
		rm -f $progressbar_dir/installing
		rm -f /tmp/regataos-gcs/installing-$game_nickname
		rm -f "/tmp/regataos-gcs/$game_download_file_name"

		if [ ! -z "$GAME_PATH" ] ;then
			echo "nickname=$game_nickname" > "$GAME_INSTALL_DIR/game-access/$game_folder/gcs-game.conf"
			echo "installdir=$GAME_INSTALL_DIR/game-access/$game_folder" >> "$GAME_INSTALL_DIR/game-access/$game_folder/gcs-game.conf"
			ln -sf "$GAME_INSTALL_DIR/game-access/$game_folder" "$HOME/Game Access/"
		fi

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1" ; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi

	else
		rm -f $progressbar_dir/progress-movement
		rm -f $progressbar_dir/progress-full
		echo $installation_error > $progressbar_dir/progress
		echo $installation_error_status > $progressbar_dir/status
		installation_failed
		sleep 2
		rm -f $progressbar_dir/installing
		rm -f /tmp/regataos-gcs/installing-$game_nickname
		rm -rf "$game_nickname_dir"
		rm -rf "$HOME/.config/regataos-gcs/custom-runtime/$custom_runtime_name"
		rm -f "$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"
		rm -f "/tmp/regataos-gcs/$game_download_file_name"
		rm -f "/tmp/regataos-gcs/$custom_runtime_file"

		if [ ! -z "$GAME_PATH" ] ;then
			rm -rf "$GAME_INSTALL_DIR/game-access/$game_folder"
		fi

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1" ; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi
	fi
}

# Verify that the installation is already in place.
if [[ $(ps aux | egrep "install-gcs-game.sh") == *"install-gcs-game.sh"* ]]; then
	if test -e "$progressbar_dir/download-extra.txt" ; then
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

# Return to system default configuration
if [ "$(cat /proc/sys/abi/vsyscall32)" -ne 1 ]; then
    pkexec sh -c 'sysctl -w abi.vsyscall32=1'
fi
