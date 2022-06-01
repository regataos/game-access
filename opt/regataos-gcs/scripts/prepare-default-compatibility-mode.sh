#!/bin/bash
#

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

# Settings and variables
export WINEDLLOVERRIDES="mscoree,mshtml="
export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode"

# Preparing the wineprefix with Winetricks
winetricks prefix=default-compatibility-mode -q -f nocrashdialog
winetricks prefix=default-compatibility-mode -q -f d3dcompiler_43
winetricks prefix=default-compatibility-mode -q -f d3dcompiler_47
winetricks prefix=default-compatibility-mode -q -f d3dx9
winetricks prefix=default-compatibility-mode -q -f vcrun2019
winetricks prefix=default-compatibility-mode -q -f vcrun2013
winetricks prefix=default-compatibility-mode -q -f riched20
winetricks prefix=default-compatibility-mode -q -f msls31

# Install DirectX
cabextract $HOME/.cache/winetricks/directx9/directx_Jun2010_redist.exe -d $HOME/.cache/winetricks/directx9/
$CUSTOM_WINE_DIR/bin/wine $HOME/.cache/winetricks/directx9/DXSETUP.exe /silent

# Install Media Foundation workaround for Wine
wget --no-check-certificate -O /tmp/regataos-gcs/mf-install-master.zip \
    https://lutris.nyc3.cdn.digitaloceanspaces.com/games/epic-games-store/mf-install-master.zip

rm -rf "/tmp/regataos-gcs/mf-install-master"
cd /tmp/regataos-gcs/
unzip mf-install-master.zip

cd /tmp/regataos-gcs/mf-install-master/
sed -i 's/cp -v/cp -vf/g' install-mf.sh

sed -i 's,wine ,/opt/regataos-wine/wine-gcs-22.7.4/bin/wine ,' install-mf.sh
sed -i 's,wine64 ,/opt/regataos-wine/wine-gcs-22.7.4/bin/wine64 ,' install-mf.sh

/bin/sh install-mf.sh

winetricks prefix=default-compatibility-mode -q -f win10

sleep 5
