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

if test -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"; then
	# We're finished!
	exit 0

elif test -e "$HOME/.local/share/wineprefixes/default-compatibility-mode"; then
	if test ! -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"; then
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

		# Prepare to copy launcher wineprefix
		if test -e "$HOME/.config/regataos-gcs/external-games-folder.txt"; then
			external_directory_file="$(cat "$HOME/.config/regataos-gcs/external-games-folder.txt")"

			if [[ $(echo $external_directory_file) != *"game-access"* ]]; then
				mkdir -p "$(echo $external_directory_file)/game-access"
				external_directory="$(echo $external_directory_file)/game-access"
			else
				external_directory="$(echo $external_directory_file)"
			fi

			if test ! -e "$(echo $external_directory)/wineprefixes-gcs"; then
				mkdir -p "$(echo $external_directory)/wineprefixes-gcs"
			fi

			if test -e "$(echo $external_directory)/wineprefixes-gcs/default-compatibility-mode"; then
				cp -rf "$(echo $external_directory)/wineprefixes-gcs/default-compatibility-mode" \
					"$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode"

			else
				rm -rf "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

				cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
					"$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode"

				ln -sf "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode" \
					"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
			fi

		else
			cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
				"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
		fi

		rm -f $progressbar_dir/progress-movement
		echo "completed" >$progressbar_dir/progress-full
		echo "" >$progressbar_dir/status
		echo $success_installation >$progressbar_dir/progress
		sleep 2
		rm -f $progressbar_dir/*
	else
		# We're finished!
		exit 0
	fi

elif test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz"; then
	if test ! -e "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"; then
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

		# Prepare to copy launcher wineprefix
		if test -e "$HOME/.config/regataos-gcs/external-games-folder.txt"; then
			external_directory_file="$(cat "$HOME/.config/regataos-gcs/external-games-folder.txt")"

			if [[ $(echo $external_directory_file) != *"game-access"* ]]; then
				mkdir -p "$(echo $external_directory_file)/game-access"
				external_directory="$(echo $external_directory_file)/game-access"
			else
				external_directory="$(echo $external_directory_file)"
			fi

			if test ! -e "$(echo $external_directory)/wineprefixes-gcs"; then
				mkdir -p "$(echo $external_directory)/wineprefixes-gcs"
			fi

			if test -e "$(echo $external_directory)/wineprefixes-gcs/default-compatibility-mode"; then
				cp -rf "$(echo $external_directory)/wineprefixes-gcs/default-compatibility-mode" \
					"$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode"

			else
				rm -rf "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

				cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
					"$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode"

				ln -sf "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode" \
					"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
			fi

		else
			cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
				"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
		fi

		rm -f $progressbar_dir/progress-movement
		echo "completed" >$progressbar_dir/progress-full
		echo "" >$progressbar_dir/status
		echo $success_installation >$progressbar_dir/progress
		sleep 2
		rm -f $progressbar_dir/*
	fi

	# We're finished!
	exit 0

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

	# Prepare to copy launcher wineprefix
	if test -e "$HOME/.config/regataos-gcs/external-games-folder.txt"; then
        external_directory_file="$(cat "$HOME/.config/regataos-gcs/external-games-folder.txt")"

        if [[ $(echo $external_directory_file) != *"game-access"* ]]; then
            mkdir -p "$(echo $external_directory_file)/game-access"
            external_directory="$(echo $external_directory_file)/game-access"
        else
            external_directory="$(echo $external_directory_file)"
        fi

		if test ! -e "$(echo $external_directory)/wineprefixes-gcs"; then
			mkdir -p "$(echo $external_directory)/wineprefixes-gcs"
		fi

		if test -e "$(echo $external_directory)/wineprefixes-gcs/default-compatibility-mode"; then
			cp -rf "$(echo $external_directory)/wineprefixes-gcs/default-compatibility-mode" \
				"$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode"

		else
			rm -rf "$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

			cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
				"$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode"

			ln -sf "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode" \
				"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
		fi

	else
		cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
			"$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"
	fi

	rm -f $progressbar_dir/progress-movement
	echo "completed" >$progressbar_dir/progress-full
	echo "" >$progressbar_dir/status
	echo $success_installation >$progressbar_dir/progress
	sleep 2
	rm -f $progressbar_dir/*
fi
