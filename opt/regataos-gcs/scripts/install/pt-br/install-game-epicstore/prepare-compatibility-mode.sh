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

# Try specifying the wine-mono and wine-gecko directory
export CUSTOM_WINE_DIR="$(cat /opt/regataos-wine/wine-gcs-version.txt)"
export WINE_MONO_CACHE_DIR="$CUSTOM_WINE_DIR/mono"
export WINE_GECKO_CACHE_DIR="$CUSTOM_WINE_DIR/gecko"

# If Vulkan is supported, enable DXVK and VKD3D-Proton
function enable_dxvk_vkd3d() {
	vulkan_test=$(vulkaninfo)
	if [[ $vulkan_test == *"Instance Extensions"* ]]; then
		if [[ $vulkan_test != *"Vulkan support is incomplete"* ]]; then
			# Enable DXVK for Direct3D 9/10/11 over Vulkan
			export WINEDLLOVERRIDES="mscoree,mshtml,winemenubuilder,winedbg,nvapi,nvapi64="
			export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode"
			/bin/sh /opt/regataos-wine/dxvk/setup_dxvk.sh install --symlink

			# Enable VKD3D-Proton for Direct3D 12 over Vulkan
			export WINEDLLOVERRIDES="mscoree,mshtml,winemenubuilder,winedbg,nvapi,nvapi64="
			export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode"
			/bin/sh /opt/regataos-wine/vkd3d-proton/setup_vkd3d_proton.sh install --symlink
		fi
	fi
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
			echo -e "DXVK\nVKD3D-Proton" > "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"
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
		vulkan_test=$(vulkaninfo)
		if [[ $vulkan_test == *"Instance Extensions"* ]]; then
			if [[ $vulkan_test != *"Vulkan support is incomplete"* ]]; then
				# Enable DXVK for Direct3D 9/10/11 over Vulkan
				export WINEDLLOVERRIDES="mscoree,mshtml,winemenubuilder,winedbg,nvapi,nvapi64="
				export WINEPREFIX="$HOME/.local/share/wineprefixes/epicstore-compatibility-mode"
				/bin/sh /opt/regataos-wine/dxvk/setup_dxvk.sh install --symlink

				# Enable VKD3D-Proton for Direct3D 12 over Vulkan
				export WINEDLLOVERRIDES="mscoree,mshtml,winemenubuilder,winedbg,nvapi,nvapi64="
				export WINEPREFIX="$HOME/.local/share/wineprefixes/epicstore-compatibility-mode"
				/bin/sh /opt/regataos-wine/vkd3d-proton/setup_vkd3d_proton.sh install --symlink
			
				echo -e "DXVK\nVKD3D-Proton" > "$HOME/.local/share/wineprefixes/epicstore-compatibility-mode/vulkan.txt"
			fi
		fi

		wineboot -u
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
export WINEDLLOVERRIDES="mscoree,mshtml,winemenubuilder,winedbg,nvapi,nvapi64=";
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
# Enable DXVK and VKD3D-Proton
if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"; then
	enable_dxvk_vkd3d
	echo -e "DXVK\nVKD3D-Proton" > "$HOME/.local/share/wineprefixes/default-compatibility-mode/vulkan.txt"
fi

echo "95%" > $progressbar_dir/progress
if test ! -e "$HOME/.local/share/wineprefixes/epicstore-compatibility-mode" ; then
	cp -rf "$HOME/.local/share/wineprefixes/default-compatibility-mode" \
	"$HOME/.local/share/wineprefixes/epicstore-compatibility-mode"
fi

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
