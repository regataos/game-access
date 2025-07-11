#!/bin/bash
#

# Settings and variables
#General information
app_name="GOG Galaxy"
app_nickname="gog"
app_name_down="Downloading GOG Galaxy"
app_name_process="Install GOG Galaxy"
app_install_status="Installing GOG Galaxy..."
app_executable="drive_c/Program Files/GOG Galaxy/GalaxyClient.exe"
app_executable2="drive_c/Program Files (x86)/GOG Galaxy/GalaxyClient.exe"
start_process="Starting installation"
conf_prefix_status="Preparing compatibility mode..."
success_installation="Concluded!"
success_notify_title="successfully installed!"
success_notify_text="has been successfully installed."
installation_error="Error!"
error_notify_title="installation error!"
error_notify_text="There was an error installing"
installation_error_status="Installation error"
progressbar_dir="/tmp/progressbar-gcs"
user=$(users | awk '{print $1}')

# Complements
app_name_dotnet40="Installing .NET Framework 4.0"
app_name_dotnet48="Installing .NET Framework 4.8"
app_name_directx="Installing DirectX Redistributable"
install_dotnet_status="This may take a few minutes..."

#Download information
app_download_status="Downloading GOG Galaxy installer..."
app_download_link="https://content-system.gog.com/open_link/download?path=/open/galaxy/client/setup_galaxy_2.0.84.107.exe"
app_download_file_name="setup_galaxy.exe"

#Default settings
app_nickname_dir="$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

# Application setup function
function install_app() {
	export WINEDEBUG=-all
	export WINEDLLOVERRIDES="winemenubuilder,winedbg="
	export WINEPREFIX="$app_nickname_dir"

	wine-gcs /tmp/regataos-gcs/$app_download_file_name /silent
}

# Successful installation
function success_installation() {
	echo "$app_nickname" >>"$HOME/.config/regataos-gcs/installed-launchers.conf"
	sed -i '/^$/d' "$HOME/.config/regataos-gcs/installed-launchers.conf"

	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$app_name $success_notify_title"

	# Create desktop shortcut
	rm -rf "$HOME/.local/share/applications/Programs/GOG.com"
	rm -f "$HOME/.local/share/applications/GOG GALAXY.desktop"
	cp -f "/opt/regataos-wine/desktop-files/GOG GALAXY.desktop" "$HOME/.local/share/applications/GOG GALAXY.desktop"

	test -f "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs" && source "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs"
	DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"

	if [ -d "$DESKTOP_DIR" ]; then
		cd "/$DESKTOP_DIR"
		rm -f "GOG GALAXY.desktop"
		ln -s "$HOME/.local/share/applications/GOG GALAXY.desktop" "GOG GALAXY.desktop"
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

		if test -e "$(echo $external_directory)/wineprefixes-gcs"; then
			mkdir -p "$(echo $external_directory)/$app_name"
			rm -rf "$app_nickname_dir/drive_c/Program Files (x86)/GOG Galaxy/Games"
			ln -sf "$(echo $external_directory)/$app_name" "$app_nickname_dir/drive_c/Program Files (x86)/GOG Galaxy/Games"
		else
			mkdir -p "$HOME/Game Access/$app_name"
			rm -rf "$app_nickname_dir/drive_c/Program Files (x86)/GOG Galaxy/Games"
			ln -sf "$HOME/Game Access/$app_name" "$app_nickname_dir/drive_c/Program Files (x86)/GOG Galaxy/Games"
		fi

	else
		mkdir -p "$HOME/Game Access/$app_name"
		rm -rf "$app_nickname_dir/drive_c/Program Files (x86)/GOG Galaxy/Games"
		ln -sf "$HOME/Game Access/$app_name" "$app_nickname_dir/drive_c/Program Files (x86)/GOG Galaxy/Games"
	fi
}

# Installation failed
function installation_failed() {
	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$app_name $error_notify_title" "$error_notify_text $app_name."

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

		# Start GOG Galaxy
		/opt/regataos-wine/apps-exec/gog start

	elif test -e "$app_nickname_dir/$app_executable2"; then
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

		# Start GOG Galaxy
		/opt/regataos-wine/apps-exec/gog start

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
		install_app

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

	elif test -e "$app_nickname_dir/$app_executable2"; then
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
