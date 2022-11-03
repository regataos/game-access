Name: regataos-gcs
Version: 5.5
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

# Update game access configuration file
users=`who | cut -d' ' -f1 | uniq`
for user in $users
do
	su - $user -c "sed -i 's/\(closed-manually=1\)/closed-manually=true/' /tmp/regataos-gcs/config/regataos-gcs.conf"
	su - $user -c "sed -i 's/\(closed-manually=0\)/closed-manually=false/' /tmp/regataos-gcs/config/regataos-gcs.conf"
done

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

%clean

%files
%defattr(-,root,root)
/opt/regataos-base/%{name}-%{version}.tar.xz
/opt/regataos-gcs/%{name}.desktop

%changelog
