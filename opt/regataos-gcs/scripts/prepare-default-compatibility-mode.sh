#!/bin/bash
#

# Settings and variables
export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode"

# Check the winetricks cache present on the system.
if test ! -e "$HOME/.cache/winetricks/vcrun2019"; then
    if test -e "/opt/regataos-wine/winetricks-cache/winetricks.tar.xz"; then
        mkdir -p "$HOME/.cache"
        tar xf "/opt/regataos-wine/winetricks-cache/winetricks.tar.xz" -C "$HOME/.cache/"
    fi
fi

# Preparing the wineprefix with Winetricks
winetricks-gcs prefix=default-compatibility-mode -q -f nocrashdialog
winetricks-gcs prefix=default-compatibility-mode -q -f d3dcompiler_43
winetricks-gcs prefix=default-compatibility-mode -q -f d3dx9
winetricks-gcs prefix=default-compatibility-mode -q -f xact
winetricks-gcs prefix=default-compatibility-mode -q -f xact_x64
winetricks-gcs prefix=default-compatibility-mode -q -f vcrun2013
winetricks-gcs prefix=default-compatibility-mode -q -f vcrun2022
winetricks-gcs prefix=default-compatibility-mode -q -f msls31

# Install d3dcompiler_47 dll
overrideDll() {
    wine-gcs reg add 'HKEY_CURRENT_USER\Software\Wine\DllOverrides' /v $1 /d native /f >/dev/null 2>&1
}

for dll in $(ls /opt/regataos-wine/dlls/default/x64/ | grep "dll"); do
    cp -fv "/opt/regataos-wine/dlls/default/x64/$dll" "$WINEPREFIX/drive_c/windows/system32/$dll"

    overrideDll $(echo "$dll" | sed s/.dll//)
done

for dll in $(ls /opt/regataos-wine/dlls/default/x32/ | grep "dll"); do
    cp -fv "/opt/regataos-wine/dlls/default/x32/$dll" "$WINEPREFIX/drive_c/windows/syswow64/$dll"

    overrideDll $(echo "$dll" | sed s/.dll//)
done

# Install DirectX Redistributable
#cabextract $HOME/.cache/winetricks/directx9/directx_Jun2010_redist.exe -d $HOME/.cache/winetricks/directx9/
#wine $HOME/.cache/winetricks/directx9/DXSETUP.exe /silent

# Install Media Foundation workaround for Wine
function installMediaFoundation() {
    wget --no-check-certificate -O /tmp/regataos-gcs/mf-install-master.zip \
        https://lutris.nyc3.cdn.digitaloceanspaces.com/games/epic-games-store/mf-install-master.zip

    rm -rf "/tmp/regataos-gcs/mf-install-master"
    cd /tmp/regataos-gcs/
    unzip mf-install-master.zip

    cd /tmp/regataos-gcs/mf-install-master/
    sed -i 's/cp -v/cp -vf/g' install-mf.sh

    /bin/sh install-mf.sh
}

# installMediaFoundation

winetricks-gcs prefix=default-compatibility-mode -q -f win10

sleep 5
