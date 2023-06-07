#!/bin/bash
#

# Settings and variables
# General information
app_name="Compatibility mode"
app_nickname="epicstore"
conf_prefix_status="Preparing compatibility mode..."
success_installation="Concluded!"
progressbar_dir="/tmp/progressbar-gcs"

# Complements
app_name_dotnet40="Installing .NET Framework 4.0"
app_name_dotnet48="Installing .NET Framework 4.8"
app_name_directx="Installing DirectX Redistributable"
install_dotnet_status="This may take a few minutes..."

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

# Check if wineprefix exists before creating a new one
if test -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/system.reg"; then
	# We're finished!
	exit 0

else
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

	# Create installation directory for Epic Games Store games
    if [[ $(echo $external_directory_file) == *"game-access"* ]]; then
		install_folder="$(echo $external_directory_file | sed 's|/game-access||')"
	fi

	mkdir -p "$(echo $install_folder)/Epic Games Store"

    # Prepare wineprefix
	if test -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/system.reg"; then
		# Configuring compatibility mode
		echo "installing" >$progressbar_dir/progress-movement
        echo "installing" >$progressbar_dir/installing
		echo "" >$progressbar_dir/progress
		echo $app_name >$progressbar_dir/app-name
		echo $conf_prefix_status >$progressbar_dir/status
		sleep 1
		echo "show progress bar" >$progressbar_dir/progressbar

		# Enable DXVK and VKD3D-Proton
		if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
			enable_dxvk_vkd3d
		fi

        # Prepare to copy wineprefix
        cp -rf $HOME/.local/share/wineprefixes/default-compatibility-mode/* \
            "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/"

		rm -f $progressbar_dir/progress-movement
		echo "completed" >$progressbar_dir/progress-full
		echo "" >$progressbar_dir/status
		echo $success_installation >$progressbar_dir/progress
		sleep 3
		rm -f $progressbar_dir/progress-full
        rm -f $progressbar_dir/installing

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1"; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi

    elif test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz"; then
        # Configuring compatibility mode
        echo "installing" >$progressbar_dir/progress-movement
        echo "installing" >$progressbar_dir/installing
        echo "" >$progressbar_dir/progress
        echo $app_name >$progressbar_dir/app-name
        echo $conf_prefix_status >$progressbar_dir/status
        sleep 1
        echo "show progress bar" >$progressbar_dir/progressbar

        # Extract the default wineprefix
        if test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz"; then
            mkdir "$HOME/.local/share/wineprefixes"

            tar xf "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" -C \
                "$HOME/.local/share/wineprefixes/"
        fi

        # Enable DXVK and VKD3D-Proton
        if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
            enable_dxvk_vkd3d
        fi

        # Prepare to copy launcher wineprefix
        cp -rf $HOME/.local/share/wineprefixes/default-compatibility-mode/* \
            "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/"

        rm -f $progressbar_dir/progress-movement
        echo "completed" >$progressbar_dir/progress-full
        echo "" >$progressbar_dir/status
        echo $success_installation >$progressbar_dir/progress
        sleep 3
		rm -f $progressbar_dir/progress-full
        rm -f $progressbar_dir/installing

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1"; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi

    else
        # Configuring compatibility mode
        echo "installing" >$progressbar_dir/progress-movement
        echo "installing" >$progressbar_dir/installing
        echo "" >$progressbar_dir/progress
        echo $app_name >$progressbar_dir/app-name
        echo $conf_prefix_status >$progressbar_dir/status
        sleep 1
        echo "show progress bar" >$progressbar_dir/progressbar

        # Create the default wineprefix
        /opt/regataos-gcs/scripts/prepare-default-compatibility-mode.sh start

        # Enable DXVK and VKD3D-Proton
        if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
            enable_dxvk_vkd3d
        fi

        # Prepare to copy launcher wineprefix
        cp -rf $HOME/.local/share/wineprefixes/default-compatibility-mode/* \
            "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode/"

        rm -f $progressbar_dir/progress-movement
        echo "completed" >$progressbar_dir/progress-full
        echo "" >$progressbar_dir/status
        echo $success_installation >$progressbar_dir/progress
        sleep 3
		rm -f $progressbar_dir/progress-full
        rm -f $progressbar_dir/installing

		# If there are no more processes, clear the progress bar cache
		if test ! -e "$progressbar_dir/queued-1"; then
			rm -f $progressbar_dir/progressbar
			rm -f $progressbar_dir/*
		fi
    fi
fi
