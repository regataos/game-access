#!/bin/bash 
#

# Settings and variables
#General information
game_nickname="$(cat /tmp/regataos-gcs/start-installation-epicstore.txt)"

#Clear cache
rm -f "/tmp/regataos-gcs/start-installation-epicstore.txt"

app_name="$(grep -r "gamename" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | awk '{print $2}' | sed 's/"\|,//g')"
game_id="$(grep -r "gameid" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | awk '{print $2}' | sed 's/"\|,//g')"
GAME_INSTALL_DIR="$GAME_PATH"
app_nickname="epicstore"
app_name_down="Baixando $app_name"
app_name_process="Instalar $app_name"
app_install_status="Instalando $app_name..."
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

# Check the game's installation folder
if [ -z "$GAME_INSTALL_DIR" ] ;then
	mkdir -p "$HOME/Game Access/Epic Games Store"
	GAME_INSTALL_DIR="$HOME/Game Access/Epic Games Store"
fi

#Complements
app_name_dotnet40="Instalando .NET Framework 4.0"
app_name_dotnet48="Instalando .NET Framework 4.8"
app_name_directx="Instalando DirectX Redistributable"
install_dotnet_status="Isso pode demorar alguns minutos..."

#Default settings
app_nickname_dir="$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

# Application setup function
function install_app() {
	winetricks prefix=$app_nickname-compatibility-mode -q win10

	/opt/regataos-gcs/legendary/legendary import-game $game_id "$(cat /tmp/regataos-gcs/game-patch-epicstore.txt)" 2>&1 | (pv -n > /tmp/regataos-gcs/instalation-legendary)
	# /opt/regataos-gcs/legendary/legendary repair -y $game_id
}

# Successful installation
function success_installation() {
    cp -f "$HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json" "$HOME/.config/regataos-gcs/installed/$game_nickname-epicstore.json"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$app_name $success_notify_title" "$app_name $success_notify_text"
}

# Installation failed
function installation_failed() {
	rm -f "$HOME/.config/regataos-gcs/installed/$game_nickname-epicstore.json"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$error_notify_title $app_name!" "$error_notify_text $app_name."
}

# Search for processes
if test -e "$progressbar_dir/installing" ; then
	# Put the process in the installation queue
	kmsg=$(grep -r $app_nickname $progressbar_dir/queued-process)
	if [[ $kmsg == *"install-epicstore-game"* ]]; then
		echo "Nothing to do."
	else
		echo "install-epicstore-game=install process-$app_name_process" >> $progressbar_dir/queued-process
	fi

	#I'm in the process queue, see you later
	exit 0
else
	# Start dependences Download
	if test ! -e "$HOME/.cache/winetricks/directx9/directx_Jun2010_redist.exe" ; then
		# Put the process in the installation queue
		kmsg=$(grep -r install-epicstore-game $progressbar_dir/queued-process)
		if [[ $kmsg == *"install-epicstore-game"* ]]; then
			echo "Nothing to do."
		else
			echo "install-epicstore-game=install process-$app_name_process" >> $progressbar_dir/queued-process
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

killall legendary
killall install-epicstore-game.sh

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
rm -f "/tmp/regataos-gcs/instalation-legendary"
rm -f "/tmp/regataos-gcs/game-patch-epicstore.txt"
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

echo "legendary" > $progressbar_dir/legendary-pid
/opt/regataos-gcs/legendary/legendary -y install --download-only $game_id --base-path "$GAME_INSTALL_DIR/" 2>&1 | (pv -n > $progressbar_dir/download-percentage-legendary)

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
	if test ! -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"; then
		echo "installing" > $progressbar_dir/progress-movement
		echo "" > $progressbar_dir/progress
		echo $app_name > $progressbar_dir/app-name
		echo $conf_prefix_status > $progressbar_dir/status

		cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
		"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
	fi

elif test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" ; then
	# Configuring compatibility mode
	echo "installing" > $progressbar_dir/progress-movement
	echo "" > $progressbar_dir/progress
	echo $app_name > $progressbar_dir/app-name
	echo $conf_prefix_status > $progressbar_dir/status

	if test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" ; then
		mkdir -p "$HOME/.local/share/wineprefixes/"
		tar xf "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" -C "$HOME/.local/share/wineprefixes/"
	fi

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
	winetricks prefix=default-compatibility-mode -q -f vcrun2012 vcrun2013

	# Download vcrun2019
	mkdir -p "$HOME/.cache/winetricks/vcrun2019/"
	wget --no-check-certificate -O "$HOME/.cache/winetricks/vcrun2019/vc_redist.x86.exe" "https://aka.ms/vs/16/release/vc_redist.x86.exe"
	wget --no-check-certificate -O "$HOME/.cache/winetricks/vcrun2019/vc_redist.x64.exe" "https://aka.ms/vs/16/release/vc_redist.x64.exe"

	export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode";
	wine $HOME/.cache/winetricks/vcrun2019/vc_redist.x86.exe /q
	wine $HOME/.cache/winetricks/vcrun2019/vc_redist.x64.exe /q

	echo "47%" > $progressbar_dir/progress
	winetricks prefix=default-compatibility-mode -q -f physx d3dcompiler_43

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
	rm -rf "/tmp/regataos-gcs/mf-install-master"
	cd /tmp/regataos-gcs/
	unzip mf-install-master.zip

	#Install
	cd /tmp/regataos-gcs/mf-install-master/
	export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode";
	sed -i 's/cp -v/cp -vf/g' install-mf.sh
	/bin/sh install-mf.sh

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

# Remove cancel script
rm -f $progressbar_dir/script-cancel

# Install app
echo $app_install_status > $progressbar_dir/status
echo "" > $progressbar_dir/progress
echo "installing" > $progressbar_dir/progress-movement
install_app

# Confirm installation
if [[ $(cat /tmp/regataos-gcs/instalation-legendary) == *"Game has been imported"* ]]; then
	rm -f $progressbar_dir/progress-movement
	echo "completed" > $progressbar_dir/progress-full
	echo "" > $progressbar_dir/status
	echo $success_installation > $progressbar_dir/progress
	echo "show installed games" > "/tmp/regataos-gcs/config/installed/show-installed-games-epic.txt"
	success_installation
	sleep 2
	rm -f $progressbar_dir/progress-full
	rm -f $progressbar_dir/installing
	rm -f /tmp/regataos-gcs/installing-$app_nickname
	rm -f "/tmp/regataos-gcs/$app_download_file_name"
	rm -f "/tmp/regataos-gcs/instalation-legendary"
	rm -f "/tmp/regataos-gcs/game-patch-epicstore.txt"

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
	rm -f "/tmp/regataos-gcs/instalation-legendary"
	rm -f "/tmp/regataos-gcs/game-patch-epicstore.txt"

	# If there are no more processes, clear the progress bar cache
	if test ! -e "$progressbar_dir/queued-1" ; then
		rm -f $progressbar_dir/progressbar
		rm -f $progressbar_dir/*
	fi
fi
}

# Verify that the installation is already in place.
if [[ $(ps aux | egrep "install-epicstore-game.sh") == *"install-epicstore-game.sh start"* ]]; then
	if test -e "$progressbar_dir/download-extra.txt" ; then
		rm -f "$progressbar_dir/download-extra.txt"
		start_installation
	else
		echo "Installation in progress..."
	fi
else
	start_installation
fi
