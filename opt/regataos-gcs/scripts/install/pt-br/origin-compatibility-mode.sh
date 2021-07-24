#!/bin/bash 
#

# Settings and variables
#General information
app_name="Origin"
app_nickname="origin"
app_name_down="Baixando o Origin"
app_name_process="Instalar o Origin"
app_install_status="Instalando o Origin..."
app_executable="drive_c/Program Files (x86)/Origin/Origin.exe"
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
app_download_status="Baixando o instalador do Origin..."
app_download_link="https://download.dm.origin.com/origin/live/OriginUpdate_10_5_101_48500.zip"
app_download_file_name="OriginUpdate_10_5_101_48500.zip"

#Default settings
app_nickname_dir="$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

# Application setup function
function install_app() {
	winetricks prefix=$app_nickname-compatibility-mode -q win10
	cd "$app_nickname_dir/drive_c/Program Files (x86)/Origin/"
	unzip OriginSetup.exe 'update/*.zip'
	unzip -o "/tmp/regataos-gcs/$app_download_file_name" -d "$app_nickname_dir/drive_c/Program Files (x86)/Origin/"
}

# Fix app
function fix_app() {
	mkdir -p "$app_nickname_dir/drive_c/Program Files (x86)/Origin"
	cp -f /opt/regataos-wine/dlls/origin/ucrtbase.dll "$app_nickname_dir/drive_c/Program Files (x86)/Origin/ucrtbase.dll"
	mkdir -p "$app_nickname_dir/drive_c/users/$user/Application Data/Origin"
	cp -f /opt/regataos-wine/custom-configs/origin/local.xml "$app_nickname_dir/drive_c/users/$user/Application Data/Origin/local.xml"
	# ln -sf /opt/regataos-wine/custom-configs/$app_nickname/dxvk.conf $app_nickname_dir/
	cp -f /opt/regataos-gcs/launchers-configs/$app_nickname/$app_nickname.conf $HOME/.config/regataos-gcs/$app_nickname.conf

	sed -i '/^$/d' $HOME/.config/regataos-gcs/$app_nickname.conf
}

# Successful installation
function success_installation() {
    echo "$app_nickname" >> "$HOME/.config/regataos-gcs/installed-launchers.conf"
	sed -i '/^$/d' "$HOME/.config/regataos-gcs/installed-launchers.conf"

    # Fix Origin pos-install
    rm -f "$app_nickname_dir/drive_c/Program Files (x86)/Origin/vcredist_x64.exe"
    rm -f "$app_nickname_dir/drive_c/Program Files (x86)/Origin/vcredist_x86.exe"

	# Notify
	notify-send -i emblem-ok-symbolic -u normal -a 'Regata OS Game Access' "$app_name $success_notify_title" "$app_name $success_notify_text"

	# Create desktop shortcut
	#Check desktop
	test -f "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs" && source "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs"
	DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"

	rm -f $HOME/.local/share/applications/*Origin.desktop
	rm -f $HOME/.local/share/applications/Origin*.desktop
	rm -f "$HOME/.local/share/applications/Origin.desktop"

	cp -f "/opt/regataos-wine/desktop-files/Origin.desktop" "$HOME/.local/share/applications/Origin.desktop"

	if [ -d "$DESKTOP_DIR" ]; then
		cd "/$DESKTOP_DIR"
		rm -f "Origin.desktop"
		ln -s "$HOME/.local/share/applications/Origin.desktop" "Origin.desktop"
	fi
}

# Create game install folder
function gameinstall_folder() {
    mkdir -p "$HOME/Game Access/$app_name"
    rm -rf "$app_nickname_dir/drive_c/Program Files (x86)/Origin Games"
    ln -sf "$HOME/Game Access/$app_name" "$app_nickname_dir/drive_c/Program Files (x86)/Origin Games"
}

# Installation failed
function installation_failed() {
	# Notify
	notify-send -i emblem-important-symbolic -u normal -a 'Regata OS Game Access' "$error_notify_title $app_name!" "$error_notify_text $app_name."
}

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

		echo dotnet > /tmp/regataos-gcs/dotnet
		/opt/regataos-gcs/scripts/install/scripts-install/directx-compatibility-mode.sh start

		#I'm in the process queue, see you later
		exit 0
	fi
fi

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
if test -e "$HOME/.local/share/wineprefixes/default-compatibility-mode" ; then
	# Configuring compatibility mode
	echo "installing" > $progressbar_dir/progress-movement
	echo "" > $progressbar_dir/progress
	echo $app_name > $progressbar_dir/app-name
	echo $conf_prefix_status > $progressbar_dir/status

	cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
	"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
else
	# Environment variables for Wine
	export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode";
	export WINEDLLOVERRIDES="mscoree,mshtml=";
	export WINEDEBUG=-all;

	# Installing .NET Framework 4.0
	#echo $app_name_dotnet40 > $progressbar_dir/app-name
	#echo $install_dotnet_status > $progressbar_dir/status
	echo "" > $progressbar_dir/progress
	echo "installing" > $progressbar_dir/progress-movement

	#winetricks prefix=default-compatibility-mode -q -f dotnet40

	# Installing .NET Framework 4.8
	#echo $app_name_dotnet48 > $progressbar_dir/app-name
	#echo $install_dotnet_status > $progressbar_dir/status

	winetricks prefix=default-compatibility-mode -q -f win10
	#winetricks prefix=default-compatibility-mode -q -f dotnet48

	# Installing DirectX Redistributable
	echo $app_name_directx > $progressbar_dir/app-name
	echo $install_dotnet_status > $progressbar_dir/status

	#Extract the DirectX files
	if test ! -e "$HOME/.cache/winetricks/directx9/DXSETUP.exe" ; then
		cabextract -d "$HOME/.cache/winetricks/directx9/" "$HOME/.cache/winetricks/directx9/directx_Jun2010_redist.exe"
	fi

	#Install DirectX
	wine $HOME/.cache/winetricks/directx9/DXSETUP.exe /silent

	# Configuring compatibility mode
	echo "installing" > $progressbar_dir/progress-movement
	echo "" > $progressbar_dir/progress
	echo $app_name > $progressbar_dir/app-name
	echo $conf_prefix_status > $progressbar_dir/status

	echo "8%" > $progressbar_dir/progress
	#winetricks prefix=default-compatibility-mode -q -f corefonts
	wine msiexec /i /usr/share/wine/gecko/wine-gecko-*-x86.msi
	wine msiexec /i /usr/share/wine/gecko/wine-gecko-*-x86_64.msi
	wine msiexec /i /usr/share/wine/mono/wine-mono-*.msi

	echo "18%" > $progressbar_dir/progress
	winetricks prefix=default-compatibility-mode -q -f nocrashdialog

	echo "32%" > $progressbar_dir/progress
	winetricks prefix=default-compatibility-mode -q -f vcrun2019

	echo "47%" > $progressbar_dir/progress
	winetricks prefix=default-compatibility-mode -q -f physx 

	echo "52%" > $progressbar_dir/progress
	winetricks prefix=default-compatibility-mode -q -f mdx

	# Install special DLLs
	echo "65%" > $progressbar_dir/progress
	cp -f /opt/regataos-wine/dlls/default/win32/* $HOME/.local/share/wineprefixes/default-compatibility-mode/drive_c/windows/system32/
	cp -f /opt/regataos-wine/dlls/default/win64/* $HOME/.local/share/wineprefixes/default-compatibility-mode/drive_c/windows/syswow64/

	override_dll() {
    	wine reg add "HKEY_CURRENT_USER\Software\Wine\DllOverrides" /v $1 /d native /f
	}

	for i in $(ls /opt/regataos-wine/dlls/default/win32/); do
		override_dll $(echo "$i" | sed s/.dll//)
	done

	for i in $(ls /opt/regataos-wine/dlls/default/win64/); do
		override_dll $(echo "$i" | sed s/.dll//)
	done

	# Install Media Foundation workaround for Wine
	echo "78%" > $progressbar_dir/progress
	#Download
	wget --no-check-certificate -O /tmp/regataos-gcs/mf-install-master.zip https://lutris.nyc3.cdn.digitaloceanspaces.com/games/epic-games-store/mf-install-master.zip

	#Extract
	cd /tmp/regataos-gcs/
	unzip mf-install-master.zip

	#Install
	cd /tmp/regataos-gcs/mf-install-master/
	export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode";
	./install-mf.sh

	echo "82%" > $progressbar_dir/progress
	# If Vulkan is supported, enable DXVK and VKD3D-Proton
	vulkan_test=$(vulkaninfo)
	if [[ $vulkan_test == *"Instance Extensions"* ]]; then
		if [[ $vulkan_test != *"Vulkan support is incomplete"* ]]; then
			# Enable DXVK for Direct3D 9/10/11 over Vulkan
			export WINEDLLOVERRIDES="mscoree,mshtml="
			export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode"
			/bin/sh /opt/regataos-wine/dxvk/setup_dxvk.sh install --symlink

			# Enable VKD3D-Proton for Direct3D 12 over Vulkan
			export WINEDLLOVERRIDES="mscoree,mshtml="
			export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode"
			/bin/sh /opt/regataos-wine/vkd3d-proton/setup_vkd3d_proton.sh install --symlink
		fi
	fi

	# Copy the default wineprefix to the new directory
	echo "90%" > $progressbar_dir/progress
	cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
	"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

	echo "95%" > $progressbar_dir/progress
	sleep 2
	echo "100%" > $progressbar_dir/progress
	sleep 3
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
	gameinstall_folder
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

# Verify that the installation is already in place.
if [[ $(ps aux | egrep "$app_nickname-compatibility-mode.sh") == *"$app_nickname-compatibility-mode.sh start"* ]]; then
	if test -e "$progressbar_dir/download-extra.txt" ; then
		rm -f "$progressbar_dir/download-extra.txt"
		start_installation
	else
		echo "Installation in progress..."
	fi
else
	start_installation
fi
