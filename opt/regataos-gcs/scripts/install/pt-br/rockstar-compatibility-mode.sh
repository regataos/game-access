#!/bin/bash 
#

# Settings and variables
#General information
app_name="Rockstar Games Launcher"
app_nickname="rockstar"
app_name_down="Baixando o Rockstar Games Launcher"
app_name_process="Instalar o Rockstar Games Launcher"
app_install_status="Instalando o Rockstar Games Launcher..."
app_executable="drive_c/Program Files/Rockstar Games/Launcher/Launcher.exe"
start_process="Iniciando a instalação"
conf_prefix_status="Preparando o modo de compatibilidade..."
success_installation="Concluído"
success_notify_title="instalado com sucesso!"
success_notify_text="foi instalado com sucesso."
installation_error="Erro"
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
app_download_status="Baixando o instalador do Rockstar Games Launcher..."

mkdir -p "/tmp/apps-scripts/"
wget --no-check-certificate -O "/tmp/apps-scripts/3370768.txt" "https://rockstar-games-launcher.en.uptodown.com/windows/download/3370768"
get_link_download=$(cat /tmp/apps-scripts/3370768.txt | grep detail-download-button | sed 's/ /\n/g' | grep href | sed 's/href\|=\|"//g')
app_download_link="$(echo $get_link_download)"

app_download_file_name="Rockstar-Games-Launcher.exe"

#Default settings
app_nickname_dir="$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

# Application setup function
function install_app() {
	export WINEPREFIX="$app_nickname_dir"
	wine /tmp/regataos-gcs/$app_download_file_name
}

# Fix app
function fix_app() {
	# Fix Rockstar Games Launcher
	cp -f /opt/regataos-gcs/launchers-configs/$app_nickname/$app_nickname.conf $HOME/.config/regataos-gcs/$app_nickname.conf

	sed -i '/^$/d' $HOME/.config/regataos-gcs/$app_nickname.conf
}

# Successful installation
function success_installation() {
    echo "$app_nickname" >> "$HOME/.config/regataos-gcs/installed-launchers.conf"
	sed -i '/^$/d' "$HOME/.config/regataos-gcs/installed-launchers.conf"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$app_name $success_notify_title" "$app_name $success_notify_text"

	# Create desktop shortcut
	#Check desktop
	test -f "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs" && source "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs"
	DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"

	rm -f "$HOME/.local/share/applications/Rockstar Games Launcher.desktop"
	cp -f "/opt/regataos-wine/desktop-files/Rockstar Games Launcher.desktop" "$HOME/.local/share/applications/Rockstar Games Launcher.desktop"

	if [ -d "$DESKTOP_DIR" ]; then
		cd "/$DESKTOP_DIR"
		rm -f "Rockstar Games Launcher.desktop"
		ln -s "$HOME/.local/share/applications/Rockstar Games Launcher.desktop" "Rockstar Games Launcher.desktop"
	fi
}

# Create game install folder
function gameinstall_folder() {
    mkdir -p "$HOME/Game Access/$app_name"
	cp -rf "$app_nickname_dir/drive_c/Program Files" "$HOME/Game Access/$app_name/"
    rm -rf "$app_nickname_dir/drive_c/Program Files"
    ln -sf "$HOME/Game Access/$app_name/Program Files" "$app_nickname_dir/drive_c/"
}

# Installation failed
function installation_failed() {
	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$error_notify_title $app_name!" "$error_notify_text $app_name."
}

# Fix Wine applications folder
rm -rf $HOME/.local/share/applications/applications

# Search for processes
if test -e "$progressbar_dir/installing" ; then
	if test ! -e "/tmp/progressbar-gcs/download-percentage-legendary"; then
		# Put the process in the installation queue
		kmsg=$(grep -r $app_nickname $progressbar_dir/queued-process)
		if [[ $kmsg == *"$app_nickname"* ]]; then
			echo "Nothing to do."
		else
			echo "$app_nickname=install process-$app_name_process" >> $progressbar_dir/queued-process
		fi

		#I'm in the process queue, see you later
		exit 0
	fi

else
	# Start dependences Download
	if test ! -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" ; then
		if test ! -e "$HOME/.cache/winetricks/directx9/directx_Jun2010_redist.exe" ; then
			# Put the process in the installation queue
			kmsg=$(grep -r $app_nickname $progressbar_dir/queued-process)
			if [[ $kmsg == *"$app_nickname"* ]]; then
				echo "Nothing to do."
			else
				echo "$app_nickname=install process-$app_name_process" >> $progressbar_dir/queued-process
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
echo "installing" > $progressbar_dir/installing
echo "installing" > /tmp/regataos-gcs/installing-$app_nickname
echo $app_name_down > $progressbar_dir/app-name
echo "0%" > $progressbar_dir/progress
echo $app_download_status > $progressbar_dir/status
sleep 1
echo "show progress bar" > $progressbar_dir/progressbar

#Download
echo "/tmp/regataos-gcs/$app_download_file_name" > $progressbar_dir/file-download-size
echo "wget --no-check-certificate -O /tmp/regataos-gcs/$app_download_file_name $app_download_link" > $progressbar_dir/get-pid
wget --no-check-certificate -O /tmp/regataos-gcs/$app_download_file_name $app_download_link 2>&1 | (pv -n > $progressbar_dir/download-percentage)
echo 100% > $progressbar_dir/progress
sleep 3
rm -f $progressbar_dir/download-percentage
rm -f $progressbar_dir/download-download-size
rm -f $progressbar_dir/download-speed
rm -f $progressbar_dir/file-size
rm -f $progressbar_dir/eta

# Prepare wineprefix to run the launcher and games
if test -e "$HOME/.local/share/wineprefixes/default-compatibility-mode"; then
	if test ! -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"; then
		# Configuring compatibility mode
		echo "installing" > $progressbar_dir/progress-movement
		echo "" > $progressbar_dir/progress
		echo $app_name > $progressbar_dir/app-name
		echo $conf_prefix_status > $progressbar_dir/status
		sleep 1
		echo "show progress bar" > $progressbar_dir/progressbar

		# Enable DXVK and VKD3D-Proton
		if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
			enable_dxvk_vkd3d
		fi

		cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
		"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
	fi

elif test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz"; then
	if test ! -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"; then
		# Configuring compatibility mode
		echo "installing" > $progressbar_dir/progress-movement
		echo "" > $progressbar_dir/progress
		echo $app_name > $progressbar_dir/app-name
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
		"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
	fi

else
	# Configuring compatibility mode
	echo "installing" > $progressbar_dir/progress-movement
	echo "" > $progressbar_dir/progress
	echo $app_name > $progressbar_dir/app-name
	echo $conf_prefix_status > $progressbar_dir/status
	sleep 1
	echo "show progress bar" > $progressbar_dir/progressbar

	/opt/regataos-gcs/scripts/prepare-default-compatibility-mode.sh start

	# Enable DXVK and VKD3D-Proton
	if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
		enable_dxvk_vkd3d
	fi

	cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
	"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
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

# Fix app
fix_app

# Install app
echo $app_install_status > $progressbar_dir/status
echo "" > $progressbar_dir/progress
echo "installing" > $progressbar_dir/progress-movement
gameinstall_folder
install_app

# Fix Wine applications folder
rm -rf $HOME/.local/share/applications/applications

# Confirm installation
if test -e "$app_nickname_dir/$app_executable" ; then
	rm -f $progressbar_dir/progress-movement
	echo "completed" > $progressbar_dir/progress-full
	echo "" > $progressbar_dir/status
	echo $success_installation > $progressbar_dir/progress
	success_installation
	sleep 2
	rm -f $progressbar_dir/progress-full
	rm -f $progressbar_dir/installing
	rm -f /tmp/regataos-gcs/installing-$app_nickname
	rm -f "/tmp/regataos-gcs/$app_download_file_name"

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
	rm -f /tmp/regataos-gcs/installing-$app_nickname
	rm -f "/tmp/regataos-gcs/$app_download_file_name"

	# If there are no more processes, clear the progress bar cache
	if test ! -e "$progressbar_dir/queued-1" ; then
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
	if test -e "$HOME/.local/share/wineprefixes/default-compatibility-mode" ; then
		# Configuring compatibility mode
		echo "installing" > $progressbar_dir/progress-movement
		echo "" > $progressbar_dir/progress
		echo $app_name > $progressbar_dir/app-name
		echo $conf_prefix_status > $progressbar_dir/status
		sleep 1
		echo "show progress bar" > $progressbar_dir/progressbar

		# Enable DXVK and VKD3D-Proton
		if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
			enable_dxvk_vkd3d
		fi

		cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
		"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

	elif test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" ; then
		if test ! -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode" ; then
			# Configuring compatibility mode
			echo "installing" > $progressbar_dir/progress-movement
			echo "" > $progressbar_dir/progress
			echo $app_name > $progressbar_dir/app-name
			echo $conf_prefix_status > $progressbar_dir/status
			sleep 1
			echo "show progress bar" > $progressbar_dir/progressbar

			if test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" ; then
				tar xf "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" -C "$HOME/.local/share/wineprefixes/"
			fi

			# Enable DXVK and VKD3D-Proton
			if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
				enable_dxvk_vkd3d
			fi

			cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
			"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
		fi

	else
		# Configuring compatibility mode
		echo "installing" > $progressbar_dir/progress-movement
		echo "" > $progressbar_dir/progress
		echo $app_name > $progressbar_dir/app-name
		echo $conf_prefix_status > $progressbar_dir/status
		sleep 1
		echo "show progress bar" > $progressbar_dir/progressbar

		/opt/regataos-gcs/scripts/prepare-default-compatibility-mode.sh start

		# Enable DXVK and VKD3D-Proton
		if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
			enable_dxvk_vkd3d
		fi

		cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
		"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
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

	# Fix app
	fix_app

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
	if test -e "$app_nickname_dir/$app_executable" ; then
		success_installation
	else
		installation_failed
	fi
}

# Verify that the installation is already in place.
if test ! -e "/tmp/progressbar-gcs/download-percentage-legendary"; then
	if [[ $(ps aux | egrep "$app_nickname-compatibility-mode.sh") == *"$app_nickname-compatibility-mode.sh start"* ]]; then
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

else
	# Progress bar is busy downloading some game, start hidden app install.
	start_hidden_installation
fi
