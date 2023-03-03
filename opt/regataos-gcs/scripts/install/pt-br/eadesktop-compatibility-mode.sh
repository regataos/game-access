#!/bin/bash
#

# Settings and variables
#General information
app_name="EA App"
app_nickname="eadesktop"
app_name_down="Baixando o $app_name"
app_name_process="Instalar o $app_name"
app_install_status="Instalando o $app_name..."
app_executable="drive_c/Program Files/Electronic Arts/EA Desktop/EA Desktop/EALauncher.exe"
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

# Complements
app_name_dotnet40="Instalando .NET Framework 4.0"
app_name_dotnet48="Instalando .NET Framework 4.8"
app_name_directx="Instalando DirectX Redistributable"
install_dotnet_status="Isso pode demorar alguns minutos..."

#Download information
app_download_status="Baixando o instalador do $app_name..."
app_download_link="https://origin-a.akamaihd.net/EA-Desktop-Client-Download/installer-releases/EAappInstaller.exe"
app_download_file_name="EAappInstaller.exe"

# Check if the wineprefix should be created in the default installation directory
# or if there is an external directory for new installations.
if test -e "$HOME/.config/regataos-gcs/external-games-folder.txt"; then
	external_directory_file="$(cat "$HOME/.config/regataos-gcs/external-games-folder.txt")"

	# Add the "game-access" folder to the external directory path for new installations.
	if [[ $(echo $external_directory_file) != *"game-access"* ]]; then
		mkdir -p "$(echo $external_directory_file)/game-access"
		external_directory="$(echo $external_directory_file)/game-access"
	else
		external_directory="$(echo $external_directory_file)"
	fi

	# Create the "wineprefixes-gcs" folder in the external installations directory.
	if test ! -e "$(echo $external_directory)/wineprefixes-gcs"; then
		mkdir -p "$(echo $external_directory)/wineprefixes-gcs"
	fi

	# Remove old wineprefix
	if test -e "$external_directory/wineprefixes-gcs/$app_nickname-compatibility-mode"; then
		rm -rf "$external_directory/wineprefixes-gcs/$app_nickname-compatibility-mode"
	fi

	# Set new wineprefix directory
	app_nickname_dir="$external_directory/wineprefixes-gcs/$app_nickname-compatibility-mode"
	mkdir -p "$app_nickname_dir"

	rm -rf "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
	ln -sf "$app_nickname_dir" "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

else
	# Set new wineprefix directory
	app_nickname_dir="$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
fi

function close_app() {
	while :; do
		ps -C "CrBrowserMain" >/dev/null
		if [ $? = 0 ]; then
			killall EALaunchHelper
			killall CrBrowserMain
			break
		fi

		sleep 1
	done
}

function install_app() {
	export WINEPREFIX="$app_nickname_dir"

	# Check the winetricks cache present on the system.
	if test ! -e "$HOME/.cache/winetricks/vcrun2019"; then
		if test -e "/opt/regataos-wine/winetricks-cache/winetricks.tar.xz"; then
			mkdir -p "$HOME/.cache"
			tar xf "/opt/regataos-wine/winetricks-cache/winetricks.tar.xz" -C "$HOME/.cache/"
		fi
	fi

	# Install add-ons with Winetricks
	winetricks prefix=$app_nickname-compatibility-mode -q -f nocrashdialog
	winetricks prefix=$app_nickname-compatibility-mode -q -f vcrun2013
	winetricks prefix=$app_nickname-compatibility-mode -q -f vcrun2019
	winetricks prefix=$app_nickname-compatibility-mode -q -f win10

	# Install d3dcompiler_47 dll
	overrideDll() {
		wine reg add 'HKEY_CURRENT_USER\Software\Wine\DllOverrides' /v $1 /d native /f >/dev/null 2>&1
	}

	for dll in $(ls /opt/regataos-wine/dlls/default/x64/ | grep "dll"); do
		cp -f "/opt/regataos-wine/dlls/default/x64/$dll" "$WINEPREFIX/drive_c/windows/system32/$dll"

		overrideDll $(echo "$dll" | sed s/.dll//)
	done

	for dll in $(ls /opt/regataos-wine/dlls/default/x32/ | grep "dll"); do
		cp -f "/opt/regataos-wine/dlls/default/x32/$dll" "$WINEPREFIX/drive_c/windows/syswow64/$dll"

		overrideDll $(echo "$dll" | sed s/.dll//)
	done

	wine "/tmp/regataos-gcs/$app_download_file_name" /silent &
	close_app

	# If Vulkan is supported, enable DXVK and VKD3D-Proton
	export WINEPREFIX="$app_nickname_dir"
	/bin/bash /opt/regataos-gcs/scripts/action-games/configure-compatibility-mode -configure-dxvk-vkd3d
}

# Successful installation
function success_installation() {
	echo "$app_nickname" >>"$HOME/.config/regataos-gcs/installed-launchers.conf"
	sed -i '/^$/d' "$HOME/.config/regataos-gcs/installed-launchers.conf"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$app_name $success_notify_title" "$app_name $success_notify_text"

	# Create desktop shortcut
	#Check desktop
	test -f "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs" && source "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs"
	DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"

	rm -f $HOME/.local/share/applications/*EA.desktop
	rm -f $HOME/.local/share/applications/EA*.desktop
	rm -f "$HOME/.local/share/applications/EALauncher.desktop"

	cp -f "/opt/regataos-wine/desktop-files/EALauncher.desktop" "$HOME/.local/share/applications/EALauncher.desktop"

	if [ -d "$DESKTOP_DIR" ]; then
		cd "/$DESKTOP_DIR"
		rm -f "EALauncher.desktop"
		ln -s "$HOME/.local/share/applications/EALauncher.desktop" "EALauncher.desktop"
	fi
}

# Create game install folder
function gameinstall_folder() {
	if test -e "$HOME/.config/regataos-gcs/external-games-folder.txt"; then
		external_directory_file="$(cat "$HOME/.config/regataos-gcs/external-games-folder.txt")"

		if [[ $(echo $external_directory_file) != *"game-access"* ]]; then
			mkdir -p "$(echo $external_directory_file)/game-access"
			external_directory="$(echo $external_directory_file)/game-access"

		else
			external_directory="$(echo $external_directory_file)"
		fi

		mkdir -p "$external_directory/$app_name"
		ln -sf "$external_directory/$app_name" "$app_nickname_dir/drive_c/Program Files/EA Games"

		mkdir -p "$HOME/Game Access"
		ln -sf "$external_directory/$app_name" "$HOME/Game Access/"

	else
		mkdir -p "$HOME/Game Access/$app_name"
		ln -sf "$HOME/Game Access/$app_name" "$app_nickname_dir/drive_c/Program Files/EA Games"
	fi
}

# Installation failed
function installation_failed() {
	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$error_notify_title $app_name" "$error_notify_text $app_name."
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

# Start installation
function start_installation() {

	# Create cancel script
	rm -f $progressbar_dir/script-cancel
	cat >$progressbar_dir/script-cancel <<EOM
#!/bin/bash 
#

killall $app_nickname-compatibility-mode.sh
killall winetricks
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

	# Set up the desktop location for Wine
	rm -rf $HOME/.local/share/applications/wine
	ln -s $HOME/.local/share/applications/ $HOME/.local/share/applications/wine
	mkdir -p $HOME/.local/share/applications/Programs

	# Remove cancel script
	rm -f $progressbar_dir/script-cancel

	# Install app
	echo $app_name >$progressbar_dir/app-name
	echo $app_install_status >$progressbar_dir/status
	echo "" >$progressbar_dir/progress
	echo "installing" >$progressbar_dir/progress-movement
	install_app

	# Fix the wineprefix desktop folder
	rm -rf "$app_nickname_dir/drive_c/users/$user/Área de Trabalho"
	rm -rf "$app_nickname_dir/drive_c/users/$user/Desktop"

	ln -sf $HOME/.local/share/applications "$app_nickname_dir/drive_c/users/$user/Área de Trabalho"
	ln -sf $HOME/.local/share/applications "$app_nickname_dir/drive_c/users/$user/Desktop"

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
		gameinstall_folder
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
	export appName="Downloading $app_name"
	export total="of"
	export estimatedTime="Estimated time"

	cd /tmp/regataos-gcs/
	/opt/regataos-gcs/tools/download_wget_zenity/download.sh "$app_download_link"

	# Prepare wineprefix to run the launcher and games
	(
		# Set up the desktop location for Wine
		rm -rf $HOME/.local/share/applications/wine
		ln -s $HOME/.local/share/applications/ $HOME/.local/share/applications/wine
		mkdir -p $HOME/.local/share/applications/Programs

		# Install app
		install_app

		# Fix the wineprefix desktop folder
		rm -rf "$app_nickname_dir/drive_c/users/$user/Área de Trabalho"
		rm -rf "$app_nickname_dir/drive_c/users/$user/Desktop"

		ln -sf $HOME/.local/share/applications "$app_nickname_dir/drive_c/users/$user/Área de Trabalho"
		ln -sf $HOME/.local/share/applications "$app_nickname_dir/drive_c/users/$user/Desktop"

		# Fix Wine applications folder
		rm -rf $HOME/.local/share/applications/applications

	) | env GTK_THEME=Adwaita:dark zenity --progress --pulsate --width 350 --window-icon "/usr/share/pixmaps/regataos-gcs.png" \
		--title "Regata OS Game Access" \
		--text "$app_name_process.\nThis may take a few minutes..." \
		--auto-close --auto-kill --no-cancel

	# Confirm installation
	if test -e "$app_nickname_dir/$app_executable"; then
		sleep 5
		success_installation
		gameinstall_folder
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
