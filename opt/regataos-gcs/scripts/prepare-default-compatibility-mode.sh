#!/bin/bash
#

# If an external directory for installations is configured,
# create a symlink to the default folder for the new wine prefixes
if test -e "$HOME/.config/regataos-gcs/external-games-folder.txt"; then
    if test ! -e "$HOME/.local/share/wineprefixes/default-compatibility-mode"; then
        external_directory_file="$(cat "$HOME/.config/regataos-gcs/external-games-folder.txt")"

        if [[ $(echo $external_directory_file) != *"game-access"* ]]; then
            mkdir -p "$(echo $external_directory_file)/game-access"
            external_directory="$(echo $external_directory_file)/game-access"
        else
            external_directory="$(echo $external_directory_file)"
        fi

        if test -e "$HOME/.local/share/wineprefixes"; then
            if [ `find "$HOME/.local/share/wineprefixes" -type f | wc -l` -eq 0 ] ; then
                rm -rf "$HOME/.local/share/wineprefixes"

                mkdir -p "$(echo $external_directory)/wineprefixes-gcs"

                ln -sf "$(echo $external_directory)/wineprefixes-gcs" \
                    "$HOME/.local/share/wineprefixes"

            else
                mkdir -p "$(echo $external_directory)/wineprefixes-gcs"
            fi

        else
            mkdir -p "$(echo $external_directory)/wineprefixes-gcs"

            ln -sf "$(echo $external_directory)/wineprefixes-gcs" \
                "$HOME/.local/share/wineprefixes"
        fi
    fi
fi

# Settings and variables
export WINEDLLOVERRIDES="mscoree,mshtml="
export WINEPREFIX="$HOME/.local/share/wineprefixes/default-compatibility-mode"

# Check the winetricks cache present on the system.
if test ! -e "$HOME/.cache/winetricks/vcrun2019"; then
    if test -e "/opt/regataos-wine/winetricks-cache/winetricks.tar.xz"; then
        mkdir -p "$HOME/.cache"
        tar xf "/opt/regataos-wine/winetricks-cache/winetricks.tar.xz" -C "$HOME/.cache/"
    fi
fi

# Preparing the wineprefix with Winetricks
winetricks prefix=default-compatibility-mode -q -f nocrashdialog
winetricks prefix=default-compatibility-mode -q -f d3dcompiler_43
winetricks prefix=default-compatibility-mode -q -f d3dx9
winetricks prefix=default-compatibility-mode -q -f xact
winetricks prefix=default-compatibility-mode -q -f xact_x64
winetricks prefix=default-compatibility-mode -q -f vcrun2013
winetricks prefix=default-compatibility-mode -q -f vcrun2019
winetricks prefix=default-compatibility-mode -q -f msls31

# Install d3dcompiler_47 dll
overrideDll() {
    wine reg add 'HKEY_CURRENT_USER\Software\Wine\DllOverrides' /v $1 /d native /f >/dev/null 2>&1
}

for dll in $(ls /opt/regataos-wine/dlls/default/x64/ | grep "dll"); do
    cp -f "/opt/regataos-wine/dlls/default/x64/$dll" "$WINEPREFIX/drive_c/windows/system32/$dll"

    overrideDll $(echo "$dll" | sed s/.dll//)
done

for dll in $(ls /opt/regataos-wine/dlls/default/x32/ | grep "dll"); do
    cp -f "/opt/regataos-wine/dlls/default/x32/$dll" "$WINEPREFIX/drive_c/windows/syswow64/$dll"

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

winetricks prefix=default-compatibility-mode -q -f win10

sleep 5
