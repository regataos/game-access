Name: regataos-gcs
Version: 4.4
Release: 0
Url: https://github.com/regataos/game-access
Summary: Access your Windows games from Regata OS
Group: System/GUI/KDE
BuildRequires: desktop-file-utils
BuildRequires: update-desktop-files
BuildRequires: hicolor-icon-theme
BuildRequires: -post-build-checks
%{?systemd_requires}
BuildRequires: systemd
BuildRequires: grep
BuildRequires: xz
Requires: xz
Requires: magma >= 5.52.2
Requires: regataos-wine-service >= 21.6.10.1
License: MIT
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

if test ! -e /opt/magma/regataosgcs ; then
	cp -f /opt/magma/magma /opt/magma/regataosgcs
fi
if test ! -e /usr/bin/regataosgcs ; then
	ln -sf /opt/magma/regataosgcs /usr/bin/regataosgcs
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
%service_add_post regataos-gcs-allsettings.service
systemctl enable  regataos-gcs-allsettings.service || true
systemctl start   regataos-gcs-allsettings.service || true
systemctl restart regataos-gcs-allsettings.service || true

# Changes for the new version of Regata OS Game Access
if test -e "/etc/xdg/autostart/regataosgcs-auto-close-game-access.desktop"; then
	# Disable obsolete systemd services
	systemctl stop regataos-gcs-selectlanguage.service || true
	systemctl disable regataos-gcs-selectlanguage.service || true

	# Remove obsolete autostart services
	rm -f "/etc/xdg/autostart/regataosgcs-auto-close-game-access.desktop"
	rm -f "/etc/xdg/autostart/regataosgcs-capture-progress-download.desktop"
	rm -f "/etc/xdg/autostart/regataosgcs-create-process-queues.desktop"
	rm -f "/etc/xdg/autostart/regataosgcs-run-process-queues.desktop"
	rm -f "/etc/xdg/autostart/regataosgcs-search-installeds.desktop"

	# Shut down services that are unnecessarily running
	killall auto-close-game-access.sh
	killall capture-progress-download
	killall create-process-queues
	killall run-process-queues
	killall search-installeds.sh
fi

# Set language according to user settings
/opt/regataos-gcs/scripts/select-language start

# Update icon caches
update-desktop-database

%clean

%files
%defattr(-,root,root)
/opt/regataos-base/%{name}-%{version}.tar.xz
/opt/regataos-gcs/%{name}.desktop

%changelog
