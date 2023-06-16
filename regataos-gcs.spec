Name: regataos-gcs
Version: 5.4
Release: 0
Url: https://github.com/regataos/game-access
Summary: Access your Windows games from Regata OS
Group: System/GUI/KDE
License: MIT
BuildRequires: desktop-file-utils
BuildRequires: update-desktop-files
BuildRequires: hicolor-icon-theme
BuildRequires: -post-build-checks
%{?systemd_requires}
BuildRequires: systemd
BuildRequires: grep
BuildRequires: xz
Requires: xz
Requires: magma >= 6.60.0
Requires: regataos-wine-service >= 21.6.21
Requires: python3-PyICU
Requires: python3-csvkit
Requires: python3-fastnumbers
Requires: python3-natsort
Requires: python3-unicodecsv
Requires: python3-json5
Source1: %{name}-%{version}.tar.xz
Source2: regataos-gcs.desktop.txt
BuildRoot: %{_tmppath}/%{name}-%{version}-build

%description
Regata OS Game Access allows you to access and run your Windows games on your Regata OS quickly and easily.

%build

%install
mkdir -p %{buildroot}/opt/regataos-base/
cp -f %{SOURCE1} %{buildroot}/opt/regataos-base/%{name}-%{version}.tar.xz

mkdir -p %{buildroot}/opt/regataos-gcs/
cp -f %{SOURCE2} %{buildroot}/opt/regataos-gcs/%{name}.desktop

%post
# Install files
if test -e /opt/regataos-base/%{name}-%{version}.tar.xz ; then
	tar xf /opt/regataos-base/%{name}-%{version}.tar.xz -C /
fi

# Fix legendary
chmod +x /opt/regataos-gcs/tools/legendary/legendary

rm -f "/opt/magma/regataosgcs"
cp -f "/opt/magma/nw" "/opt/magma/regataosgcs"

if test ! -e "/usr/bin/regataosgcs"; then
	ln -sf "/opt/magma/regataosgcs" "/usr/bin/regataosgcs"
fi

if test ! -e /opt/regataos-gcs/www/cache ; then
	ln -sf /tmp/regataos-gcs/config/cache /opt/regataos-gcs/www/cache
fi

if test ! -e /tmp/progressbar-gcs ; then
	mkdir -p "/tmp/progressbar-gcs/"
	chmod 777 "/tmp/progressbar-gcs"
else
	chmod 777 "/tmp/progressbar-gcs"
fi

# Change the permission of the games json files folder
if test -e "/opt/regataos-gcs/games-list" ; then
	chmod 777 "/opt/regataos-gcs/games-list"
fi

# Start system services
systemctl daemon-reload
systemctl enable --now regataos-gcs-select-language.service
systemctl enable --now regataos-gcs-allsettings.service

# Changes for the new version of Regata OS Game Access
if test ! -e /usr/share/regataos/create-iso.txt ; then
	# Set language according to user settings
	/opt/regataos-gcs/scripts/select-language start

	# Update icon caches
	update-desktop-database
fi

# Fix script symlinks
ln -sf /opt/regataos-gcs/scripts/install/pt-br/install-game-gcs/install-gcs-game.sh \
/opt/regataos-gcs/scripts/install/pt-br/gcs-compatibility-mode.sh

ln -sf /opt/regataos-gcs/scripts/install/en-us/install-game-gcs/install-gcs-game.sh \
/opt/regataos-gcs/scripts/install/en-us/gcs-compatibility-mode.sh

# Update LoL custom wine
user=$(users | awk '{print $1}')
customRuntimeDir="/home/$user/.config/regataos-gcs/custom-runtime"
wineVersion="8.7"
wineFile="lutris-ge-lol-$wineVersion-1-x86_64"
wineLink="https://github.com/GloriousEggroll/wine-ge-custom/releases/download/$wineVersion-GE-1-LoL/wine-$wineFile.tar.xz"

if test -e "$customRuntimeDir/lol.txt"; then
  if [[ $(cat "$customRuntimeDir/lol.txt") != *"$wineFile"* ]]; then
    wget --no-check-certificate -O "$customRuntimeDir/wine-$wineFile.tar.xz" "$wineLink"

    tar xf "$customRuntimeDir/wine-$wineFile.tar.xz" -C "$customRuntimeDir/"
    echo "$customRuntimeDir/$wineFile" > "$customRuntimeDir/lol.txt"

    sudo chown --recursive $user:users "$customRuntimeDir/$wineFile"
    sudo chown $user:users "$customRuntimeDir/lol.txt"
    rm -f "$customRuntimeDir/wine-$wineFile.tar.xz"
  fi
fi

# Fix for legendary
if [[ $(ls -la /home/$user/.config/legendary/ | grep "\->") == *"config.ini"* ]]; then
  rm -rf "/home/$user/.config/legendary/config.ini"
fi

# Revome Origin game
if [[ $(ls -la /opt/regataos-gcs/games-list/ | grep "origin.json") == *"origin.json"* ]]; then
  rm -f /opt/regataos-gcs/games-list/*-origin.json
fi

# Remove old wineprefix
if test ! -e "/tmp/progressbar-gcs/installing"; then
  if test -e "/home/$user/.local/share/wineprefixes/default-compatibility-mode"; then
    rm -rf "/home/$user/.local/share/wineprefixes/default-compatibility-mode"
  fi
fi

%clean

%files
%defattr(-,root,root)
/opt/regataos-base/%{name}-%{version}.tar.xz
/opt/regataos-gcs/%{name}.desktop

%changelog
