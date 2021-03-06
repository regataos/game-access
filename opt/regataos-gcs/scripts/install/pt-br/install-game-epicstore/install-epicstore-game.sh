#!/bin/bash 
#

# Settings and variables
#General information
if [ -z "$game_nickname" ] ;then
	game_nickname="$(cat /tmp/regataos-gcs/start-installation-epicstore.txt)"
fi

#Clear cache
rm -f "/tmp/regataos-gcs/start-installation-epicstore.txt"

app_name="$(grep -r "gamename" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_id="$(grep -r "gameid" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | awk '{print $2}' | sed 's/"\|,//g')"
game_folder="$(grep -r "game_folder" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
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

# Application setup function
function install_app() {
	rm -f "/tmp/regataos-gcs/game-patch-epicstore.txt"
	/opt/regataos-gcs/tools/legendary/legendary import "$app_name" "$GAME_INSTALL_DIR/$game_folder" "$(cat /tmp/regataos-gcs/game-patch-epicstore.txt)" 2>&1 | (pv -n > /tmp/regataos-gcs/instalation-legendary)
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
	kmsg=$(grep -r $game_nickname $progressbar_dir/queued-process)
	if [[ $kmsg == *"$game_nickname"* ]]; then
		echo "Nothing to do."
	else
		echo "$game_nickname=epicstore process-$app_name_process" >> $progressbar_dir/queued-process
	fi

	#I'm in the process queue, see you later
	exit 0

else
	# Start dependences Download
	if test ! -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" ; then
		if test ! -e "$HOME/.cache/winetricks/directx9/directx_Jun2010_redist.exe" ; then
			# Put the process in the installation queue
			kmsg=$(grep -r $game_nickname $progressbar_dir/queued-process)
			if [[ $kmsg == *"$game_nickname"* ]]; then
				echo "Nothing to do."
			else
				echo "$game_nickname=epicstore process-$app_name_process" >> $progressbar_dir/queued-process
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

killall install-epicstore-game.sh
pkill --signal CONT legendary
killall legendary

if [ ! -z "$GAME_INSTALL_DIR" ] ;then
	rm -f "/tmp/regataos-gcs/$app_download_file_name"
fi

if test ! -e $progressbar_dir/queued-1 ; then
	rm -f $progressbar_dir/*
fi

echo "0%" > $progressbar_dir/progress
rm -f $progressbar_dir/app-name
rm -f $progressbar_dir/download-percentage-legendary
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

if test -e "$GAME_INSTALL_DIR/$game_folder/.egstore"; then
	/opt/regataos-gcs/tools/legendary/legendary -y install --repair "$game_id" --base-path "$GAME_INSTALL_DIR/" 2>&1 | (pv -n > $progressbar_dir/download-percentage-legendary)
else
	/opt/regataos-gcs/tools/legendary/legendary -y install --download-only "$game_id" --base-path "$GAME_INSTALL_DIR/" 2>&1 | (pv -n > $progressbar_dir/download-percentage-legendary)
fi

/opt/regataos-gcs/tools/legendary/legendary -y activate --uplay "$game_id"
/opt/regataos-gcs/tools/legendary/legendary -y activate --origin "$game_id"

echo 100% > $progressbar_dir/progress
sleep 3
rm -f $progressbar_dir/download-percentage-legendary
rm -f $progressbar_dir/speed
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

# Remove cancel script
rm -f $progressbar_dir/script-cancel

# Install app
echo $app_install_status > $progressbar_dir/status
echo "" > $progressbar_dir/progress
echo "installing" > $progressbar_dir/progress-movement
install_app

# Confirm installation
if [[ $(cat /tmp/regataos-gcs/instalation-legendary) == *"has been imported"* ]]; then
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
	#rm -f "/tmp/regataos-gcs/game-patch-epicstore.txt"

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
	#rm -f "/tmp/regataos-gcs/game-patch-epicstore.txt"

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
		if test -e "$progressbar_dir/installing"; then
			echo "Installation in progress..."
		else
			start_installation
		fi
	fi
else
	start_installation
fi
