#!/bin/bash
#

# Settings and variables
# General information
app_name="Modo de compatibilidade"
app_nickname="epicstore"
conf_prefix_status="Preparando o modo de compatibilidade..."
success_installation="Concluído!"
progressbar_dir="/tmp/progressbar-gcs"

# Complements
app_name_dotnet40="Instalando .NET Framework 4.0"
app_name_dotnet48="Instalando .NET Framework 4.8"
app_name_directx="Instalando DirectX Redistributable"
install_dotnet_status="Isso pode demorar alguns minutos..."

# If Vulkan is supported, enable DXVK and VKD3D-Proton
function enable_dxvk_vkd3d() {
	export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode"
	/bin/bash /opt/regataos-gcs/scripts/action-games/configure-compatibility-mode -configure-dxvk-vkd3d
}

# Check if wineprefix exists before creating a new one
if test -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"; then
	# We're finished!
	exit 0

else
    # Check and choose the wineprefix creation directory
    if test -e "$HOME/.config/regataos-gcs/external-games-folder.txt"; then
        external_directory_file="$(cat "$HOME/.config/regataos-gcs/external-games-folder.txt")"

        if [[ $(echo $external_directory_file) != *"game-access"* ]]; then
            mkdir -p "$(echo $external_directory_file)/game-access"
            external_directory="$(echo $external_directory_file)/game-access"

        else
            external_directory="$(echo $external_directory_file)"
        fi

        if test -e "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode"; then
            mkdir "$HOME/.local/share/wineprefixes"

            ln -sf "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode" \
                "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

            # We're finished!
            exit 0

        else
            if test ! -e "$(echo $external_directory)/wineprefixes-gcs"; then
                mkdir -p "$(echo $external_directory)/wineprefixes-gcs"
            fi

            mkdir -p "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode"
            mkdir "$HOME/.local/share/wineprefixes"

            ln -sf "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode" \
                "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
        fi

		# Create installation directory for Epic Games Store games
		mkdir -p "$(echo $external_directory)/Epic Games Store"
    fi

    # Prepare wineprefix
	if test -e "$HOME/.local/share/wineprefixes/default-compatibility-mode"; then
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
