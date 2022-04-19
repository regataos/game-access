#!/bin/bash 
#

# Settings and variables
# General information
app_name="Modo de compatibilidade"
conf_prefix_status="Preparando o modo de compatibilidade..."
success_installation="Concluído"
progressbar_dir="/tmp/progressbar-gcs"

# Complements
app_name_dotnet40="Instalando .NET Framework 4.0"
app_name_dotnet48="Instalando .NET Framework 4.8"
app_name_directx="Instalando DirectX Redistributable"
install_dotnet_status="Isso pode demorar alguns minutos..."

# Variables for custom Wine
export CUSTOM_WINE_DIR="$(cat /opt/regataos-wine/wine-gcs-version.txt)"

export WINEDLLPATH="$CUSTOM_WINE_DIR/lib:$CUSTOM_WINE_DIR/lib64"
export WINESERVER="$CUSTOM_WINE_DIR/bin/wineserver"
export WINELOADER="$CUSTOM_WINE_DIR/bin/wine"
export WINE="$CUSTOM_WINE_DIR/bin/wine"

alias wine="$CUSTOM_WINE_DIR/bin/wine"
alias wine64="$CUSTOM_WINE_DIR/bin/wine64"
alias wineserver="$CUSTOM_WINE_DIR/bin/wineserver"
alias wineboot="$CUSTOM_WINE_DIR/bin/wineboot"
alias winecfg="$CUSTOM_WINE_DIR/bin/winecfg"
alias msiexec="$CUSTOM_WINE_DIR/bin/msiexec"

# Try specifying the wine-mono and wine-gecko directory
export WINE_MONO_CACHE_DIR="$CUSTOM_WINE_DIR/mono"
export WINE_GECKO_CACHE_DIR="$CUSTOM_WINE_DIR/gecko"

# If Vulkan is supported, enable DXVK and VKD3D-Proton
function enable_dxvk_vkd3d() {
	export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode"
	/bin/bash /opt/regataos-gcs/scripts/action-games/configure-compatibility-mode -configure-dxvk-vkd3d
}

if test -e "$HOME/.local/share/wineprefixes/epicstore-compatibility-mode" ; then
	# We're finished!
	exit 0

elif test -e "$HOME/.local/share/wineprefixes/default-compatibility-mode" ; then
	if test ! -e "$HOME/.local/share/wineprefixes/epicstore-compatibility-mode" ; then
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
		"$HOME/.local/share/wineprefixes/epicstore-compatibility-mode"

		winetricks prefix=epicstore-compatibility-mode -q -f win10

		rm -f $progressbar_dir/progress-movement
		echo "completed" > $progressbar_dir/progress-full
		echo "" > $progressbar_dir/status
		echo $success_installation > $progressbar_dir/progress
		sleep 2
		rm -f $progressbar_dir/*
	else
		# We're finished!
		exit 0
	fi

elif test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" ; then
	if test ! -e "$HOME/.local/share/wineprefixes/epicstore-compatibility-mode" ; then
		# Configuring compatibility mode
		echo "installing" > $progressbar_dir/progress-movement
		echo "" > $progressbar_dir/progress
		echo $app_name > $progressbar_dir/app-name
		echo $conf_prefix_status > $progressbar_dir/status
		sleep 1
		echo "show progress bar" > $progressbar_dir/progressbar

		if test -e "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" ; then
			mkdir -p "$HOME/.local/share/wineprefixes/"
			tar xf "/usr/share/regataos/compatibility-mode/default-wineprefix.tar.xz" -C "$HOME/.local/share/wineprefixes/"
		fi

		mv -f "$HOME/.local/share/wineprefixes/default-compatibility-mode" "$HOME/.local/share/wineprefixes/epicstore-compatibility-mode"

		# If Vulkan is supported, enable DXVK and VKD3D-Proton
		export WINEPREFIX="$HOME/.local/share/wineprefixes/epicstore-compatibility-mode"
		/bin/bash /opt/regataos-gcs/scripts/action-games/configure-compatibility-mode -configure-dxvk-vkd3d
		winetricks prefix=epicstore-compatibility-mode -q -f win10

		rm -f $progressbar_dir/progress-movement
		echo "completed" > $progressbar_dir/progress-full
		echo "" > $progressbar_dir/status
		echo $success_installation > $progressbar_dir/progress
		sleep 2
		rm -f $progressbar_dir/*
	fi

	# We're finished!
	exit 0

else
	# Prepare the progress bar
	rm -f $progressbar_dir/progress-movement
	echo "installing" > $progressbar_dir/installing
	echo $app_name > $progressbar_dir/app-name
	echo $conf_prefix_status > $progressbar_dir/status
	sleep 1
	echo "show progress bar" > $progressbar_dir/progressbar

	# Start dependences Download
	if test ! -e "$HOME/.cache/winetricks/directx9/directx_Jun2010_redist.exe" ; then
		echo dotnet > /tmp/regataos-gcs/dotnet
		/opt/regataos-gcs/scripts/install/scripts-install/directx-compatibility-mode.sh start
	fi

	# Environment variables for Wine
	echo "0%" > $progressbar_dir/progress
	export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode";
	export WINEDLLOVERRIDES="mscoree,mshtml,winemenubuilder,winedbg=";
	export WINEDEBUG=-all;

	# Configuring compatibility mode
	echo "installing" > $progressbar_dir/progress-movement
	echo "" > $progressbar_dir/progress
	echo $app_name > $progressbar_dir/app-name
	echo $conf_prefix_status > $progressbar_dir/status

	echo "8%" > $progressbar_dir/progress
	winetricks prefix=default-compatibility-mode -q -f d3dx9

	echo "18%" > $progressbar_dir/progress
	winetricks prefix=default-compatibility-mode -q -f corefonts

	echo "32%" > $progressbar_dir/progress
	winetricks prefix=default-compatibility-mode -q -f nocrashdialog

	echo "47%" > $progressbar_dir/progress
	winetricks prefix=default-compatibility-mode -q -f d3dcompiler_43

	echo "52%" > $progressbar_dir/progress
	winetricks prefix=default-compatibility-mode -q -f d3dcompiler_47

	echo "65%" > $progressbar_dir/progress
	winetricks prefix=default-compatibility-mode -q -f vcrun2019

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
	/bin/bash install-mf.sh

	echo "82%" > $progressbar_dir/progress
	# Enable DXVK and VKD3D-Proton
	if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
		enable_dxvk_vkd3d
	fi

	echo "95%" > $progressbar_dir/progress
	if test ! -e "$HOME/.local/share/wineprefixes/epicstore-compatibility-mode" ; then
		cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
		"$HOME/.local/share/wineprefixes/epicstore-compatibility-mode"
	fi

	winetricks prefix=default-compatibility-mode -q -f win10
	winetricks prefix=epicstore-compatibility-mode -q -f win10

	echo "100%" > $progressbar_dir/progress
	sleep 3

	rm -f $progressbar_dir/progress-movement
	echo "completed" > $progressbar_dir/progress-full
	echo "" > $progressbar_dir/status
	echo $success_installation > $progressbar_dir/progress
	sleep 2
	rm -f $progressbar_dir/*
fi
