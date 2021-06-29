%define service_name1 regataos-gcs-allsettings
%define service_name2 regataos-gcs-selectlanguage

Name: regataos-gcs
Version: 4.1
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
Requires: magma >= 5.52.2-lp152.6.1
Requires: regataos-wine-service >= 5.9
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

# Fix "auto close game access"
if test -e /etc/xdg/autostart/regataosgcs-auto-open-game-access.desktop ; then
  rm -f "/etc/xdg/autostart/regataosgcs-auto-open-game-access.desktop"
  killall auto-open-game-access.sh
fi

if test -e /etc/xdg/autostart/regataosgcs-close-launchers.desktop ; then
  rm -f "/etc/xdg/autostart/regataosgcs-close-launchers.desktop"
  killall close-launchers.sh
fi

# Start system services
%service_add_post %{service_name1}.service
systemctl enable  %{service_name1}.service || true
systemctl start   %{service_name1}.service || true
systemctl restart %{service_name1}.service || true

%service_add_post %{service_name2}.service
systemctl enable  %{service_name2}.service || true
systemctl start   %{service_name2}.service || true
systemctl restart %{service_name2}.service || true

# Update icon caches
update-desktop-database

%clean

%files
%defattr(-,root,root)
/opt/regataos-base/%{name}-%{version}.tar.xz
/opt/regataos-gcs/%{name}.desktop

%changelog
