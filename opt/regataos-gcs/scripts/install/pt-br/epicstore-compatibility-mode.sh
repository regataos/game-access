#!/bin/bash
#

# Settings and variables
#General information
app_name="Epic Games Store"
app_nickname="epicstore"
app_name_down="Baixando a Epic Games Store"
app_name_process="Instalar a Epic Games Store"
app_install_status="Instalando a Epic Games Store..."
app_executable="drive_c/Program Files (x86)/Epic Games/Launcher/Portal/Binaries/Win32/EpicGamesLauncher.exe"
start_process="Iniciando a instalação"
conf_prefix_status="Preparando o modo de compatibilidade..."
success_installation="Concluído!"
success_notify_title="instalada com sucesso!"
success_notify_text="foi instalada com sucesso."
installation_error="Erro!"
error_notify_title="Erro na instalação da"
error_notify_text="Ocorreu algum erro na instalação da"
installation_error_status="Erro na instalação"
progressbar_dir="/tmp/progressbar-gcs"
user=$(users | awk '{print $1}')

# Complements
app_name_dotnet40="Instalando .NET Framework 4.0"
app_name_dotnet48="Instalando .NET Framework 4.8"
app_name_directx="Instalando DirectX Redistributable"
install_dotnet_status="Isso pode demorar alguns minutos..."

# Download information
app_download_status="Baixando o instalador da Epic Games Store..."
app_download_link="https://launcher-public-service-prod06.ol.epicgames.com/launcher/api/installer/download/EpicGamesLauncherInstaller.msi"
app_download_file_name="EpicGamesLauncherInstaller.msi"

# Default settings
app_nickname_dir="$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

# Application setup function
function install_app() {
	export WINEDEBUG=-all
	export WINEDLLOVERRIDES="winemenubuilder,winedbg="
	export WINEPREFIX="$app_nickname_dir"

	wine-gcs /tmp/regataos-gcs/$app_download_file_name /quiet

	# Install Uplay
	wget --no-check-certificate -O /tmp/regataos-gcs/UbisoftConnectInstaller.exe https://ubistatic3-a.akamaihd.net/orbit/launcher_installer/UbisoftConnectInstaller.exe
	wine-gcs /tmp/regataos-gcs/UbisoftConnectInstaller.exe /S

	mkdir -p "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/drive_c/users/$user/Local Settings/Application Data/Ubisoft Game Launcher/"
	cp -f /opt/regataos-wine/custom-configs/ubisoftconnect/settings.yml "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/drive_c/users/$user/Local Settings/Application Data/Ubisoft Game Launcher/settings.yml"

	mkdir -p "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/drive_c/users/$user/AppData/Local/Ubisoft Game Launcher/"
	cp -f /opt/regataos-wine/custom-configs/ubisoftconnect/settings.yml "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/drive_c/users/$user/AppData/Local/Ubisoft Game Launcher/settings.yaml"

	#killall EpicGamesLauncher.exe
	#sleep 120
}

# Successful installation
function success_installation() {
	echo "$app_nickname" >>"$HOME/.config/regataos-gcs/installed-launchers.conf"
	sed -i '/^$/d' "$HOME/.config/regataos-gcs/installed-launchers.conf"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$app_name $success_notify_title"

	# Create desktop shortcut
	rm -f "$HOME/.local/share/applications/Programs/Epic Games Launcher.desktop"
	rm -f "$HOME/.local/share/applications/Epic Games Launcher.desktop"
	cp -f "/opt/regataos-wine/desktop-files/Epic Games Launcher.desktop" "$HOME/.local/share/applications/Epic Games Launcher.desktop"

	test -f "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs" && source "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs"
	DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"

	if [ -d "$DESKTOP_DIR" ]; then
		cd "/$DESKTOP_DIR"
		rm -f "Epic Games Launcher.desktop"
		ln -s "$HOME/.local/share/applications/Epic Games Launcher.desktop" "Epic Games Launcher.desktop"
	fi
}

# Create game install folder
function gameinstall_folder() {
	rm -f "$app_nickname_dir/drive_c/Program Files/Epic Games"
	rm -f "$app_nickname_dir/drive_c/Program Files (x86)/Epic Games"

	if test -e "$HOME/.config/regataos-gcs/external-games-folder.txt"; then
		external_directory_file="$(cat "$HOME/.config/regataos-gcs/external-games-folder.txt")"

		if [[ $(echo $external_directory_file) != *"game-access"* ]]; then
			mkdir -p "$(echo $external_directory_file)/game-access"
			external_directory="$(echo $external_directory_file)/game-access"
		else
			external_directory="$(echo $external_directory_file)"
		fi

		if test -e "$(echo $external_directory)/wineprefixes-gcs"; then
			mkdir -p "$(echo $external_directory)/$app_name/Epic Games"
			mkdir -p "$(echo $external_directory)/$app_name/Epic Games(x86)"

			ln -sf "$(echo $external_directory)/$app_name/Epic Games" "$app_nickname_dir/drive_c/Program Files/"
			ln -sf "$(echo $external_directory)/$app_name/Epic Games(x86)" "$app_nickname_dir/drive_c/Program Files (x86)/Epic Games"

		else
			mkdir -p "$HOME/Game Access/$app_name/Epic Games"
			mkdir -p "$HOME/Game Access/$app_name/Epic Games(x86)"

			ln -sf "$HOME/Game Access/$app_name/Epic Games" "$app_nickname_dir/drive_c/Program Files/"
			ln -sf "$HOME/Game Access/$app_name/Epic Games(x86)" "$app_nickname_dir/drive_c/Program Files (x86)/Epic Games"
		fi

	else
		mkdir -p "$HOME/Game Access/$app_name/Epic Games"
		mkdir -p "$HOME/Game Access/$app_name/Epic Games(x86)"

		ln -sf "$HOME/Game Access/$app_name/Epic Games" "$app_nickname_dir/drive_c/Program Files/"
		ln -sf "$HOME/Game Access/$app_name/Epic Games(x86)" "$app_nickname_dir/drive_c/Program Files (x86)/Epic Games"
	fi
}

# Installation failed
function installation_failed() {
	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$error_notify_title $app_name!" "$error_notify_text $app_name."

	rm -rf "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode"
	rm -rf "$app_nickname_dir"
}

# Fix Wine applications folder
rm -rf $HOME/.local/share/applications/applications

# Search for processes
if test -e "$progressbar_dir/installing"; then
	if test ! -e "/tmp/progressbar-gcs/download-percentage-legendary"; then
		# Put the process in the installation queue
		kmsg=$(grep -r $app_nickname $progressbar_dir/queued-process)
		if [[ $kmsg == *"$app_nickname"* ]]; then
			echo "Nothing to do."
		else
			echo "$app_nickname=install process-$app_name_process" >>$progressbar_dir/queued-process
		fi

		#I'm in the process queue, see you later
		exit 0
	fi

else
	# Start dependences Download
	if test ! -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz"; then
		if test ! -e "$HOME/.cache/winetricks/directx9/directx_Jun2010_redist.exe"; then
			# Put the process in the installation queue
			kmsg=$(grep -r $app_nickname $progressbar_dir/queued-process)
			if [[ $kmsg == *"$app_nickname"* ]]; then
				echo "Nothing to do."
			else
				echo "$app_nickname=install process-$app_name_process" >>$progressbar_dir/queued-process
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

killall $app_nickname-compatibility-mode.sh
killall winetricks-gcs
rm -rf "$app_nickname_dir"
rm -f "/tmp/regataos-gcs/$app_download_file_name"

if test ! -e $progressbar_dir/queued-1 ; then
	rm -f $progressbar_dir/*
fi

echo "0%" > $progressbar_dir/progress
rm -f $progressbar_dir/get-pid
rm -f $progressbar_dir/installing
rm -f "/tmp/regataos-gcs/installing-$app_nickname"
rm -f $progressbar_dir/down-paused
rm -f $progressbar_dir/script-cancel
EOM

	chmod +x $progressbar_dir/script-cancel

	# Prepare the progress bar and downloading
	rm -f $progressbar_dir/progress-movement
	echo "installing" >$progressbar_dir/installing
	echo "installing" >/tmp/regataos-gcs/installing-$app_nickname
	echo $app_name_down >$progressbar_dir/app-name
	echo "0%" >$progressbar_dir/progress
	echo $app_download_status >$progressbar_dir/status
	sleep 1
	echo "show progress bar" >$progressbar_dir/progressbar

	#Download
	echo "/tmp/regataos-gcs/$app_download_file_name" >$progressbar_dir/file-download-size
	echo "wget --no-check-certificate -O /tmp/regataos-gcs/$app_download_file_name $app_download_link" >$progressbar_dir/get-pid
	wget --no-check-certificate -O /tmp/regataos-gcs/$app_download_file_name $app_download_link 2>&1 | (pv -n >$progressbar_dir/download-percentage)
	echo 100% >$progressbar_dir/progress
	sleep 3
	rm -f $progressbar_dir/download-percentage
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

	# Set up the desktop location for Wine
	rm -rf $HOME/.local/share/applications/wine
	ln -s $HOME/.local/share/applications/ $HOME/.local/share/applications/wine
	mkdir -p $HOME/.local/share/applications/Programs

	# Fix the wineprefix desktop folder
	rm -rf "$app_nickname_dir/drive_c/users/$user/Área de Trabalho"
	rm -rf "$app_nickname_dir/drive_c/users/$user/Desktop"

	ln -sf $HOME/.local/share/applications "$app_nickname_dir/drive_c/users/$user/Área de Trabalho"
	ln -sf $HOME/.local/share/applications "$app_nickname_dir/drive_c/users/$user/Desktop"

	# Remove cancel script
	rm -f $progressbar_dir/script-cancel

	# Install app
	echo $app_install_status >$progressbar_dir/status
	echo "" >$progressbar_dir/progress
	echo "installing" >$progressbar_dir/progress-movement
	gameinstall_folder
	install_app

	# Fix Wine applications folder
	rm -rf $HOME/.local/share/applications/applications

	# Confirm installation
	if test -e "$app_nickname_dir/$app_executable"; then
		rm -f $progressbar_dir/progress-movement
		echo "completed" >$progressbar_dir/progress-full
		echo "" >$progressbar_dir/status
		echo $success_installation >$progressbar_dir/progress
		sleep 5
		success_installation
		sleep 2
		rm -f $progressbar_dir/progress-full
		rm -f $progressbar_dir/installing
		rm -f /tmp/regataos-gcs/installing-$app_nickname
		rm -f "/tmp/regataos-gcs/$app_download_file_name"

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
		rm -f "/tmp/regataos-gcs/$app_download_file_name"

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1"; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi
	fi
}

# Start Hidden app install
function start_hidden_installation() {
	# Download
	export appName="Baixando $app_name"
	export total="de"
	export estimatedTime="Tempo estimado"

	cd /tmp/regataos-gcs/
	/opt/regataos-gcs/tools/download_wget_zenity/download.sh "$app_download_link"

	# Prepare wineprefix to run the launcher and games
	(
		if test -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/system.reg"; then
			if test ! -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/system.reg"; then
				# Enable DXVK and VKD3D-Proton
				if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
					enable_dxvk_vkd3d
				fi
			fi

		elif test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz"; then
			if test ! -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/system.reg"; then
				# Configuring compatibility mode
				if test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz"; then
					tar xf "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" -C "$HOME/.local/share/wineprefixes/"
				fi

				# Enable DXVK and VKD3D-Proton
				if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
					enable_dxvk_vkd3d
				fi
			fi

		else
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

		# Set up the desktop location for Wine
		rm -rf $HOME/.local/share/applications/wine
		ln -s $HOME/.local/share/applications/ $HOME/.local/share/applications/wine
		mkdir -p $HOME/.local/share/applications/Programs

		# Fix the wineprefix desktop folder
		rm -rf "$app_nickname_dir/drive_c/users/$user/Área de Trabalho"
		rm -rf "$app_nickname_dir/drive_c/users/$user/Desktop"

		ln -sf $HOME/.local/share/applications "$app_nickname_dir/drive_c/users/$user/Área de Trabalho"
		ln -sf $HOME/.local/share/applications "$app_nickname_dir/drive_c/users/$user/Desktop"

		# Install app
		gameinstall_folder
		install_app

		# Fix Wine applications folder
		rm -rf $HOME/.local/share/applications/applications

	) | env GTK_THEME=Adwaita:dark zenity --progress --pulsate --width 350 --window-icon "/usr/share/pixmaps/regataos-gcs.png" \
		--title "Regata OS Game Access" \
		--text "$app_name_process.\nIsso pode levar alguns minutos..." \
		--auto-close --auto-kill --no-cancel

	# Confirm installation
	if test -e "$app_nickname_dir/$app_executable"; then
		sleep 5
		success_installation
	else
		installation_failed
	fi
}

# Verify that the installation is already in place.
if test ! -e "/tmp/progressbar-gcs/download-percentage-legendary"; then
	if [[ $(ps aux | egrep "$app_nickname-compatibility-mode.sh") == *"$app_nickname-compatibility-mode.sh start"* ]]; then
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

else
	# Progress bar is busy downloading some game, start hidden app install.
	start_hidden_installation
fi
