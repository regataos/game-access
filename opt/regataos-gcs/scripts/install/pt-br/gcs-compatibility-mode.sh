#!/bin/bash
#

# Download compatibility mode
if test ! -e "/opt/wine-gcs/bin/wine"; then
	/opt/regataos-gcs/scripts/install/scripts-install/download-wine-gcs.sh start
fi

# Settings and variables
if [ -z $gameNickname ]; then
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

else
	if test -e "/tmp/regataos-gcs/start-installation-gcs.txt"; then
		rm -f "/tmp/regataos-gcs/start-installation-gcs.txt"
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
GCS_CONFIG="$HOME/.config/regataos-gcs/regataos-gcs.conf"

# Check the game's installation folder
function create_installation_directory() {
	installation_folder=""

	if test -e "/tmp/regataos-gcs/$game_nickname-installdir.txt"; then
		installation_folder=$(cat "/tmp/regataos-gcs/$game_nickname-installdir.txt")
	fi

	if [ ! -z "$installation_folder" ]; then
		installation_folder=$(echo "$installation_folder")
	else
		if [ ! -z "$GAME_PATH" ]; then
			installation_folder=$(echo "$GAME_PATH")
		else
			if test -e "/tmp/regataos-gcs/config/external-games-folder.txt"; then
				installation_folder="$(cat /tmp/regataos-gcs/config/external-games-folder.txt)"
			fi
		fi
	fi

	if [ -z "$installation_folder" ]; then
		if [[ $(echo $game_plataform) == *"linux"* ]]; then
			rm -rf "$HOME/Game Access/$game_nickname"
			mkdir -p "$HOME/Game Access/$game_nickname"
		fi

		downloadDir="/tmp/regataos-gcs/config/tmp"
		mkdir -p "$downloadDir"

	else
		if [[ $(echo $installation_folder) == *"game-access/$game_nickname"* ]]; then
			install_folder="$(echo $installation_folder | sed "s|/game-access/$game_nickname||")"

		elif [[ $(echo $installation_folder) == *"game-access"* ]]; then
			install_folder="$(echo $installation_folder | sed 's|/game-access||')"

		else
			install_folder="$(echo $installation_folder)"
		fi

		rm -rf "$install_folder/game-access/$game_nickname"
		mkdir -p "$install_folder/game-access/$game_nickname"
		mkdir -p "$install_folder/game-access/tmp"

		rm -rf "$HOME/Game Access/$game_nickname"
		ln -sf "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode" \
			"$HOME/Game Access/$game_nickname"

		downloadDir="$install_folder/game-access/tmp"

		rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"
	fi

	if [[ $(echo $game_plataform) == *"windows"* ]]; then
		GAME_INSTALL_DIR="$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode"
	else
		GAME_INSTALL_DIR="$HOME/Game Access/$game_nickname"
	fi
}

# Clear desktop
clearDesktopIcons() {
	while :; do
		test -f "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs" && source "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs"
		DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"

		if [ -d "$DESKTOP_DIR" ]; then
			if test -e "$DESKTOP_DIR/Riot Client.desktop"; then
				cd "/$DESKTOP_DIR"
				rm -f "League of Legends.desktop"
				rm -f "Riot Client.desktop"
				rm -f "Riot Client.lnk"

				rm -rf "$HOME/.local/share/applications/wine/Programs/Riot Games"
				rm -rf "$HOME/.local/share/applications/Programs/Riot Games"

				break
			fi

			if test -e "$DESKTOP_DIR/Warframe.lnk"; then
				cd "/$DESKTOP_DIR"
				rm -f "Warframe.lnk"

				break
			fi
		fi

		sleep 1
	done
}

# Application setup function
function install_app() {
	if [[ $(echo $game_plataform) == *"windows"* ]]; then
		# Prepare wineprefix for NTFS partitions
		if [ ! -z "$installation_folder" ]; then
			cp -rf "$GAME_INSTALL_DIR"/* "$install_folder/game-access/$game_nickname/"

			for f in "$install_folder/game-access/$game_nickname"/*; do
				file_name=$(echo $f | sed 's|/| |g' | awk '{print $NF}')

				if [[ $(echo $file_name) != *"dosdevices"* ]]; then
					rm -rf "$GAME_INSTALL_DIR/$file_name"
					ln -sf "$f" "$GAME_INSTALL_DIR/"
				else
					rm -rf "$install_folder/game-access/$game_nickname/dosdevices"
					ln -sf "$GAME_INSTALL_DIR/dosdevices" "$install_folder/game-access/$game_nickname/dosdevices"
				fi
			done
		fi

		export WINEDEBUG=-all
		export WINEPREFIX="$GAME_INSTALL_DIR"
		export WINEESYNC=1
		export WINEFSYNC=1
		export WINEFSYNC_FUTEX2=1
		export WINE_LARGE_ADDRESS_AWARE=1
		#export DXVK_STATE_CACHE=reset
		export DXVK_STATE_CACHE_PATH="$GAME_INSTALL_DIR"
		export DXVK_LOG_PATH="$GAME_INSTALL_DIR"
		export RADV_PERFTEST=gpl

		# DXVK-NVAPI
		if [[ $(cat "$GAME_INSTALL_DIR/vulkan.txt") == *"DXVK-NVAPI"* ]]; then
			export WINEDLLOVERRIDES="winemenubuilder,winedbg="
		else
			export WINEDLLOVERRIDES="winemenubuilder,winedbg,nvapi,nvapi64="
		fi

		# DXVK configuration file
		if test -e "$GAME_INSTALL_DIR/dxvk.conf"; then
			export DXVK_CONFIG_FILE="$GAME_INSTALL_DIR/dxvk.conf"
		fi

		# Enable AMD FSR
		if [[ $(grep -r amd-fsr $GCS_CONFIG) == *"amd-fsr=true"* ]]; then
			export WINE_FULLSCREEN_FSR=1
			export WINE_FULLSCREEN_FSR_STRENGTH=2
		fi

		# Enable performance info
		if [[ $(grep -r fps $GCS_CONFIG) == *"fps=true"* ]]; then
			export MANGOHUD=1
			export MANGOHUD_DLSYM=1
			export MANGOHUD_GL="mangohud --dlsym"
			export DXVK_HUD=compiler
			#export DXVK_HUD=devinfo,fps,frametimes,gpuload,api,compiler
		fi

		# For the NVIDIA proprietary driver
		if test -e /usr/bin/nvidia-xconfig; then
			# For the NVIDIA proprietary driver
			export __GL_SHADER_DISK_CACHE=1
			export __GL_SHADER_DISK_CACHE_PATH="$GAME_INSTALL_DIR"
			export __GL_SHADER_DISK_CACHE_SKIP_CLEANUP=1

			# If necessary, run software with the NVIDIA dGPU
			if test -e "/tmp/regataos-prime/use-hybrid-graphics.txt"; then
				export GAMEMODERUNEXEC="env __NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia __VK_LAYER_NV_optimus=NVIDIA_only $(echo $MANGOHUD_GL)"
			else
				export GAMEMODERUNEXEC="env $(echo $MANGOHUD_GL)"
			fi

			# Special configurations for DXVK with NVIDIA GPU
			if [[ $(echo $game_plataform) == *"windows"* ]]; then
				ln -sf "/opt/regataos-wine/custom-configs/gcs/dxvk-nvidia.conf" "$GAME_INSTALL_DIR/dxvk.conf"
			fi

		else
			# If necessary, run software with the AMD/Intel dGPU
			if test -e "/tmp/regataos-prime/use-hybrid-graphics.txt"; then
				export GAMEMODERUNEXEC="env DRI_PRIME=1 $(echo $MANGOHUD_GL)"
			else
				export GAMEMODERUNEXEC="env $(echo $MANGOHUD_GL)"
			fi

			# Special configurations for DXVK with AMD/Intel GPU
			if [[ $(echo $game_plataform) == *"windows"* ]]; then
				ln -sf "/opt/regataos-wine/custom-configs/gcs/dxvk.conf" "$GAME_INSTALL_DIR/dxvk.conf"
			fi
		fi

		if [[ $(echo $custom_runtime) == *"true"* ]]; then
			# Variables for custom Wine
			export CUSTOM_WINE_DIR="$(cat $HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt)"

			export WINEDLLPATH="$CUSTOM_WINE_DIR/lib/wine:$CUSTOM_WINE_DIR/lib64/wine"
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
				clearDesktopIcons &
				$CUSTOM_WINE_DIR/bin/wine $downloadDir/$game_download_file_name $install_args

			else
				$CUSTOM_WINE_DIR/bin/wine $downloadDir/$game_download_file_name $install_args
			fi

		elif [[ $(echo $game_nickname) == *"warframe"* ]]; then
			clearDesktopIcons &
			wine-gcs $downloadDir/$game_download_file_name $install_args

		else
			wine-gcs $downloadDir/$game_download_file_name $install_args
		fi

	else
		if [[ $(echo $game_download_file_name) == *".zip"* ]]; then
			unzip -u "$downloadDir/$game_download_file_name" -d "$GAME_INSTALL_DIR/"
		fi
	fi
}

# Successful installation
function success_installation() {
	cp -f "/opt/regataos-gcs/games-list/$game_nickname.json" "$HOME/.config/regataos-gcs/installed/$game_nickname.json"
	rm -f "$HOME/Game Access/$game_nickname"

	if [ ! -z "$installation_folder" ]; then
		echo -e "nickname=$game_nickname\ninstalldir=$install_folder/game-access/$game_nickname\n" > \
			"$install_folder/game-access/$game_nickname/gcs-game.conf"

		if [[ $(echo $game_plataform) == *"windows"* ]]; then
			ln -sf $(echo "$install_folder/game-access/$game_nickname" | sed 's/-compatibility-mode//') "$HOME/Game Access/"
		else
			ln -sf "$install_folder/game-access/$game_nickname" "$HOME/Game Access/"
		fi

	else
		ln -sf "$GAME_INSTALL_DIR" "$HOME/Game Access/$game_nickname"
	fi

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$game_name $success_notify_title"
}

# Installation failed
function installation_failed() {
	rm -f "$HOME/.config/regataos-gcs/installed/$game_nickname.json"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$error_notify_title $game_name!" "$error_notify_text $game_name."
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

			if [[ $(echo $GAME_PATH) != *"$HOME/Game Access"* ]]; then
				echo "$GAME_PATH" >"/tmp/regataos-gcs/$game_nickname-installdir.txt"
			fi

			echo "$game_nickname=gcs process-$game_name_process" >>$progressbar_dir/queued-process
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
				echo "$game_nickname" >>"/tmp/regataos-gcs/gcs-for-install.txt"
				sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

				if [[ $(echo $GAME_PATH) != *"$HOME/Game Access"* ]]; then
					echo "$GAME_PATH" >"/tmp/regataos-gcs/$game_nickname-installdir.txt"
				fi

				echo "$game_nickname=gcs process-$game_name_process" >>$progressbar_dir/queued-process
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

# Start installation
function start_installation() {
	#Prepare game installation folder
	create_installation_directory

	# Create cancel script
	rm -f $progressbar_dir/script-cancel
	cat >$progressbar_dir/script-cancel <<EOM
	#!/bin/bash 
	#

	killall install-gcs-game.sh
	killall winetricks-gcs
	rm -rf "$GAME_INSTALL_DIR"
	rm -rf "$HOME/.config/regataos-gcs/custom-runtime/$custom_runtime_name"
	rm -f "$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"
	rm -f "$downloadDir/$game_download_file_name"
	rm -f "/tmp/regataos-gcs/$custom_runtime_file"
	rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"
	sed -i "/$gameNickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
	sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

	echo "0%" > $progressbar_dir/progress
	rm -f $progressbar_dir/get-pid
	rm -f $progressbar_dir/installing
	rm -f "/tmp/regataos-gcs/installing-$game_nickname"
	rm -f $progressbar_dir/down-paused
	rm -f $progressbar_dir/script-cancel

	if test ! -e $progressbar_dir/queued-1 ; then
		rm -f $progressbar_dir/*
	fi
EOM

	chmod +x $progressbar_dir/script-cancel

	# Prepare the progress bar and downloading custom runtime
	if [[ $(echo $custom_runtime) == *"true"* ]]; then
		if test ! -e "$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"; then
			rm -f $progressbar_dir/progress-movement
			echo "installing" >$progressbar_dir/installing
			echo "installing" >/tmp/regataos-gcs/installing-$game_nickname
			echo $game_name >$progressbar_dir/app-name
			echo "0%" >$progressbar_dir/progress
			echo "$game_runtime_down" >$progressbar_dir/status
			sleep 1
			echo "show progress bar" >$progressbar_dir/progressbar

			# Download
			echo "$downloadDir/$custom_runtime_file" >$progressbar_dir/file-download-size
			echo "wget --no-check-certificate -O $downloadDir/$custom_runtime_file $custom_runtime_download" >$progressbar_dir/get-pid
			wget --no-check-certificate -O "$downloadDir/$custom_runtime_file" "$custom_runtime_download" 2>&1 | (pv -n >$progressbar_dir/download-percentage)
			echo 100% >$progressbar_dir/progress
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
	echo "installing" >$progressbar_dir/installing
	echo "installing" >/tmp/regataos-gcs/installing-$game_nickname
	echo $game_name >$progressbar_dir/app-name
	echo "0%" >$progressbar_dir/progress
	echo "$game_name_down" >$progressbar_dir/status
	sleep 1
	echo "show progress bar" >$progressbar_dir/progressbar

	# Download
	echo "$downloadDir/$game_download_file_name" >$progressbar_dir/file-download-size
	echo "wget --no-check-certificate -O $downloadDir/$game_download_file_name $game_download" >$progressbar_dir/get-pid

	if test ! -e "$downloadDir/$game_download_file_name"; then
		wget --no-check-certificate -O "$downloadDir/$game_download_file_name" "$game_download" 2>&1 | (pv -n >$progressbar_dir/download-percentage)
	fi

	echo 100% >$progressbar_dir/progress
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
					mkdir -p "$GAME_INSTALL_DIR"
					tar xf "$downloadDir/$custom_runtime_file" -C "$GAME_INSTALL_DIR/"
					ln -sf "$GAME_INSTALL_DIR/$custom_runtime_name" "$HOME/.config/regataos-gcs/custom-runtime/"
				fi

				echo "$HOME/.config/regataos-gcs/custom-runtime/$custom_runtime_name" \
					>"$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"

				rm -f "$downloadDir/$custom_runtime_file"
			fi

			/opt/regataos-gcs/scripts/install/scripts-install/install-game-gcs/prepare-compatibility-mode -lcm $game_nickname

		else
			/opt/regataos-gcs/scripts/install/scripts-install/install-game-gcs/prepare-compatibility-mode -dcm $game_nickname
		fi
	fi

	# Remove cancel script
	rm -f $progressbar_dir/script-cancel

	# Install app
	echo $game_install_status >$progressbar_dir/status
	echo "" >$progressbar_dir/progress
	echo "installing" >$progressbar_dir/progress-movement
	echo "show progress bar" >$progressbar_dir/progressbar
	install_app

	# Confirm installation
	if test -e "$GAME_INSTALL_DIR/$game_folder/$file_executable"; then
		rm -f $progressbar_dir/progress-movement
		echo "completed" >$progressbar_dir/progress-full
		echo "" >$progressbar_dir/status
		echo $success_installation >$progressbar_dir/progress
		echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games-gcs.txt"
		success_installation
		sleep 2
		rm -f $progressbar_dir/progress-full
		rm -f $progressbar_dir/installing
		rm -f /tmp/regataos-gcs/installing-$game_nickname
		rm -f "$downloadDir/$game_download_file_name"
		rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"
		sed -i "/$gameNickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
		sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1"; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi

	elif test -e "$GAME_INSTALL_DIR/$file_executable"; then
		rm -f $progressbar_dir/progress-movement
		echo "completed" >$progressbar_dir/progress-full
		echo "" >$progressbar_dir/status
		echo $success_installation >$progressbar_dir/progress
		echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games-gcs.txt"
		success_installation
		sleep 2
		rm -f $progressbar_dir/progress-full
		rm -f $progressbar_dir/installing
		rm -f /tmp/regataos-gcs/installing-$game_nickname
		rm -f "$downloadDir/$game_download_file_name"
		rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"
		sed -i "/$gameNickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
		sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1"; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi

	elif test -e "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode/$file_executable"; then
		rm -f $progressbar_dir/progress-movement
		echo "completed" >$progressbar_dir/progress-full
		echo "" >$progressbar_dir/status
		echo $success_installation >$progressbar_dir/progress
		echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games-gcs.txt"
		success_installation
		sleep 2
		rm -f $progressbar_dir/progress-full
		rm -f $progressbar_dir/installing
		rm -f /tmp/regataos-gcs/installing-$game_nickname
		rm -f "$downloadDir/$game_download_file_name"
		rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"
		sed -i "/$gameNickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
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
		rm -f /tmp/regataos-gcs/installing-$game_nickname
		rm -rf "$HOME/.config/regataos-gcs/custom-runtime/$custom_runtime_name"
		rm -f "$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"
		rm -f "$downloadDir/$game_download_file_name"
		rm -f "$GAME_INSTALL_DIR/$custom_runtime_name"
		rm -f "/tmp/regataos-gcs/$custom_runtime_file"
		rm -f "/tmp/regataos-gcs/$game_nickname-installdir.txt"
		sed -i "/$gameNickname/d" "/tmp/regataos-gcs/gcs-for-install.txt"
		sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"

		if [ ! -z "$game_nickname" ]; then
			echo -e "-- GAME_PATH: $GAME_PATH\n"
			rm -rf "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode"
			rm -rf "$install_folder/game-access/$game_nickname"
			rm -rf "$(echo "$HOME/Game Access/$game_nickname")"-*
			rm -rf "$GAME_INSTALL_DIR"
		fi

		if [ ! -z "$game_folder" ]; then
			rm -rf "$install_folder/game-access/$game_folder"
		fi

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1"; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi

		# Stop clearDesktopIcons function
		if [[ $(echo $game_nickname) == *"lol"* ]]; then
			test -f "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs" && source "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs"
			DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"

			if [ -d "$DESKTOP_DIR" ]; then
				echo "" >"$DESKTOP_DIR/Riot Client.desktop"
			fi
		fi

		if [[ $(echo $game_nickname) == *"warframe"* ]]; then
			test -f "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs" && source "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs"
			DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"

			if [ -d "$DESKTOP_DIR" ]; then
				echo "" >"$DESKTOP_DIR/Warframe.lnk"
			fi
		fi

		exit 0
	fi
}

# Verify that the installation is already in place.
if [[ $(ps aux | egrep "install-gcs-game.sh") == *"install-gcs-game.sh"* ]]; then
	if test -e "$progressbar_dir/download-extra.txt"; then
		rm -f "$progressbar_dir/download-extra.txt"
		start_installation >"/var/log/regataos-logs/install-gcs-game-$game_nickname.log"
	else
		if test -e "$progressbar_dir/installing"; then
			echo "Installation in progress..."
		else
			start_installation >"/var/log/regataos-logs/install-gcs-game-$game_nickname.log"
		fi
	fi
else
	start_installation >"/var/log/regataos-logs/install-gcs-game-$game_nickname.log"
fi

# Return to system default configuration
ps -C "RiotClientServi" >/dev/null
if [ $? = 1 ]; then
	if [ "$(cat /proc/sys/abi/vsyscall32)" -ne 1 ]; then
		pkexec sh -c 'sysctl -w abi.vsyscall32=1'
	fi
fi
