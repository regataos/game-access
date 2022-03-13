#!/bin/bash 
#

# Settings and variables
#General information
app_name="League of Legends"
app_nickname="lol"
app_name_down="Downloading League of Legends"
app_name_process="Install League of Legends"
app_install_status="Installing League of Legends..."
app_executable="drive_c/Riot Games/League of Legends/LeagueClient.exe"
start_process="Starting installation"
conf_prefix_status="Preparing compatibility mode..."
success_installation="Concluded"
success_notify_title="successfully installed!"
success_notify_text="has been successfully installed."
installation_error="Error"
error_notify_title="installation error!"
error_notify_text="There was an error installing"
installation_error_status="Installation error"
progressbar_dir="/tmp/progressbar-gcs"
user=$(users | awk '{print $1}')

#dotnet
app_name_dotnet40="Installing .NET Framework 4.0"
app_name_dotnet48="Installing .NET Framework 4.8"
install_dotnet_status="This may take a few minutes..."

#Download information
app_download_status="Downloading LoL installer..."
app_download_link="https://lol.secure.dyn.riotcdn.net/channels/public/x/installer/current/live.br.exe"
app_download_file_name="lol.exe"

#Default settings
app_nickname_dir="$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

# Variables for custom Wine
export CUSTOM_WINE_DIR="$(cat /opt/regataos-wine/wine-gcs-version.txt)"
export WINESERVER=$CUSTOM_WINE_DIR/bin/wineserver
export WINELOADER=$CUSTOM_WINE_DIR/bin/wine
export WINEDLLPATH=$CUSTOM_WINE_DIR/lib:$CUSTOM_WINE_DIR/lib64
export WINE="$CUSTOM_WINE_DIR/bin/wine"

# Try specifying the wine-mono and wine-gecko directory
export WINE_MONO_CACHE_DIR="$CUSTOM_WINE_DIR/mono"
export WINE_GECKO_CACHE_DIR="$CUSTOM_WINE_DIR/gecko"

# Create game install folder
#function gameinstall_folder() {
#    mkdir -p "$HOME/Game Access/$app_name"
#    mkdir -p "$app_nickname_dir/drive_c/Riot Games"
#    ln -sf "$HOME/Game Access/$app_name" "$app_nickname_dir/drive_c/Riot Games/"
#}

# Application setup function
function install_app() {
	export WINEDLLOVERRIDES="nvapi,nvapi64="; WINEPREFIX="$app_nickname_dir" $CUSTOM_WINE_DIR/bin/wine /tmp/regataos-gcs/$app_download_file_name --mode unattended
}

# Fix app
function fix_app() {
	# Fix League of Legends
	# ln -sf /opt/regataos-wine/custom-configs/$app_nickname/dxvk.conf $app_nickname_dir/
	cp -f /opt/regataos-gcs/launchers-configs/$app_nickname/$app_nickname.conf $HOME/.config/regataos-gcs/$app_nickname.conf

	sed -i '/^$/d' $HOME/.config/regataos-gcs/$app_nickname.conf
}

# Successful installation
function success_installation() {
	# Start config .desktop file
	echo OK > /tmp/regataos-gcs/config-$app_nickname.Desktop
    echo "$app_nickname" >> "$HOME/.config/regataos-gcs/installed-launchers.conf"
	sed -i '/^$/d' "$HOME/.config/regataos-gcs/installed-launchers.conf"

	rm -f "$HOME/.local/share/applications/Uninstall League of Legends.desktop"

	# Notify
	notify-send -i emblem-ok-symbolic -u normal -a 'Regata OS Game Access' "$app_name $success_notify_title" "$app_name $success_notify_text"
}

# Installation failed
function installation_failed() {
	# Notify
	notify-send -i emblem-important-symbolic -u normal -a 'Regata OS Game Access' "$app_name $error_notify_title" "$error_notify_text $app_name."
}

# Verify that the installation is already in place.
if test ! -e /tmp/regataos-gcs/installing-$app_nickname ; then

# Fix Wine applications folder
rm -rf $HOME/.local/share/applications/applications

# Search for processes
if test -e "$progressbar_dir/installing" ; then
	# Put the process in the installation queue
	kmsg=$(grep -r $app_nickname $progressbar_dir/queued-process)
	if [[ $kmsg == *"$app_nickname"* ]]; then
		echo "Nothing to do."
	else
		echo "$app_nickname=install process-$app_name_process" >> $progressbar_dir/queued-process
	fi

	#I'm in the process queue, see you later
	exit 0
else
	# Start dependences Download
	if test ! -e "$HOME/.cache/winetricks/directx9/directx_Jun2010_redist.exe" ; then
		# Put the process in the installation queue
		kmsg=$(grep -r $app_nickname $progressbar_dir/queued-process)
		if [[ $kmsg == *"$app_nickname"* ]]; then
			echo "Nothing to do."
		else
			echo "$app_nickname=install process-$app_name_process" >> $progressbar_dir/queued-process
		fi

		/opt/regataos-gcs/scripts/install/scripts-install/directx-compatibility-mode.sh start

		#I'm in the process queue, see you later
		exit 0
	fi
fi

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

# Configuring compatibility mode
echo "installing" > $progressbar_dir/progress-movement
echo "" > $progressbar_dir/progress
echo $app_name > $progressbar_dir/app-name
echo $conf_prefix_status > $progressbar_dir/status
#echo "8%" > $progressbar_dir/progress
#export WINEDLLOVERRIDES="mscoree,mshtml="; export WINEDEBUG=-all; winetricks prefix=$app_nickname-compatibility-mode -q corefonts

echo "17%" > $progressbar_dir/progress
export WINEDLLOVERRIDES="mscoree,mshtml="; export WINEDEBUG=-all; WINEPREFIX="$app_nickname_dir" wine msiexec /i /usr/share/wine/gecko/wine-gecko-*-x86.msi
export WINEDLLOVERRIDES="mscoree,mshtml="; export WINEDEBUG=-all; WINEPREFIX="$app_nickname_dir" wine msiexec /i /usr/share/wine/gecko/wine-gecko-*-x86_64.msi

echo "23%" > $progressbar_dir/progress
export WINEDLLOVERRIDES="mscoree,mshtml="; export WINEDEBUG=-all; WINEPREFIX="$app_nickname_dir" wine msiexec /i /usr/share/wine/mono/wine-mono-*.msi

echo "38%" > $progressbar_dir/progress
export WINEDEBUG=-all; winetricks prefix=$app_nickname-compatibility-mode -q nocrashdialog

echo "42%" > $progressbar_dir/progress
export WINEDEBUG=-all; winetricks prefix=$app_nickname-compatibility-mode -q vcrun2019

echo "65%" > $progressbar_dir/progress
export WINEDEBUG=-all; winetricks prefix=$app_nickname-compatibility-mode -q d3dcompiler_43 d3dcompiler_47 d3dx9 d3dx10_43

echo "78%" > $progressbar_dir/progress
export WINEDEBUG=-all; winetricks prefix=$app_nickname-compatibility-mode -q win7

echo "90%" > $progressbar_dir/progress
sleep 1

echo "95%" > $progressbar_dir/progress

# If Vulkan is supported, enable the D9VK
kmsg=$(vulkaninfo)
if [[ $kmsg == *"Instance Extensions"* ]]; then
	kmsg=$(vulkaninfo)
	if [[ $kmsg == *"Ivybridge"* ]]; then
		# Ivy Bridge Vulkan support is incomplete, using OpenGL
		if test ! -e /usr/bin/nvidia-xconfig ; then
			echo "There is no full support for Vulkan!"
		fi
	else
		# Enable DXVK for Direct3D 10/11 over Vulkan
		export WINEDLLOVERRIDES="mscoree,mshtml="
		export WINEPREFIX="$app_nickname_dir"
		/bin/sh /opt/regataos-wine/dxvk/setup_dxvk.sh install --symlink --without-dxgi
	fi
fi

echo "100%" > $progressbar_dir/progress
sleep 3

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
#gameinstall_folder
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
	sleep 5
	rm -f $progressbar_dir/progress-full
	rm -f $progressbar_dir/installing
	rm -f /tmp/regataos-gcs/installing-$app_nickname
	rm -f "/tmp/regataos-gcs/$app_download_file_name"

	# If there are no more processes, clear the progress bar cache
	if test ! -e "$progressbar_dir/queued-1" ; then
		rm -f $progressbar_dir/progressbar
		rm -f $progressbar_dir/*
	fi
elif test -e "$app_nickname_dir/$app_executable2" ; then
	rm -f $progressbar_dir/progress-movement
	echo "completed" > $progressbar_dir/progress-full
	echo "" > $progressbar_dir/status
	echo $success_installation > $progressbar_dir/progress
	success_installation
	sleep 5
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
	sleep 5
	rm -f $progressbar_dir/installing
	rm -f /tmp/regataos-gcs/installing-$app_nickname
	rm -f "/tmp/regataos-gcs/$app_download_file_name"

	# If there are no more processes, clear the progress bar cache
	if test ! -e "$progressbar_dir/queued-1" ; then
		rm -f $progressbar_dir/progressbar
		rm -f $progressbar_dir/*
	fi
fi

fi
