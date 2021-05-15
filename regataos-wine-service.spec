%define service_name regataos-wine

Name: regataos-wine-service
Version: 6.5
Release: 0
Summary: Compatibility mode for Regata OS Store
License: MIT
Url: https://github.com/regataos/game-access
Source1: regataos-wine-service.tar.xz
Source2: regataos-wine.service
Group: System/GUI/KDE
BuildRequires: xz
BuildRequires: desktop-file-utils
BuildRequires: update-desktop-files
BuildRequires: hicolor-icon-theme
BuildRequires: -post-build-checks
BuildRoot: %{_tmppath}/%{name}-%{version}-build
Requires: regataos-wine >= 6.5
Requires: regataos-gcs
Requires: libvkd3d1
Requires: libvkd3d1-32bit
Requires: libvkd3d-utils1
Requires: libvkd3d-utils1-32bit
Requires: libvkd3d-shader1
Requires: libvkd3d-shader1-32bit
Requires: fetchmsttfonts
Requires: libexe-tools
Requires: libexe1
Requires: mspack-tools
Requires: libgthread-2_0-0
Requires: libgthread-2_0-0-32bit
Requires: sc-controller

%description
This package provides tools that brings support for the compatibility mode of the Regata OS Store.

%build

%install
mkdir -p %buildroot/opt/regataos-wine/
cp -f %{SOURCE1} %{buildroot}/opt/regataos-wine/regataos-wine-service.tar.xz
mkdir -p %{buildroot}%{_unitdir}
cp -f %{SOURCE2} %{buildroot}%{_unitdir}/%{service_name}.service

%post
if test -e /opt/regataos-wine/regataos-wine-service.tar.xz ; then
	tar xf /opt/regataos-wine/regataos-wine-service.tar.xz -C /
fi

# freetype font smoothing for win32 applications
rm -f /etc/fonts/conf.avail/30-win32-aliases.conf
rm -f /etc/fonts/conf.d/30-win32-aliases.conf
cat > /etc/fonts/conf.avail/30-win32-aliases.conf << EOM
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <alias binding="same">
    <family>MS Shell Dlg</family>
    <accept><family>Microsoft Sans Serif</family></accept>
    <default><family>sans-serif</family></default>
  </alias>
  <alias binding="same">
    <family>MS Shell Dlg 2</family>
    <accept><family>Tahoma</family></accept>
    <default><family>sans-serif</family></default>
  </alias>

  <alias binding="same">
    <family>MS Sans Serif</family>
    <prefer><family>Microsoft Sans Serif</family></prefer>
    <default><family>sans-serif</family></default>
  </alias>
</fontconfig>
EOM

ln -s /etc/fonts/conf.avail/30-win32-aliases.conf /etc/fonts/conf.d/30-win32-aliases.conf
sudo fc-cache -f

# Start service
%service_add_post %{service_name}.service
systemctl enable  %{service_name}.service || true
systemctl start   %{service_name}.service || true
systemctl restart %{service_name}.service || true

# Create folder for log files
if test -e /var/log/regataos-logs ; then
	cd /var/log/
	chmod 777 regataos-logs
else
	cd /var/log/
	mkdir -p regataos-logs
	chmod 777 regataos-logs
fi

# Fix for regataos-gcs folder
if test ! -e /tmp/regataos-gcs ; then
  mkdir -p /tmp/regataos-gcs/
  chmod 777 /tmp/regataos-gcs
fi

# Update cache
echo update regataos-wine > /tmp/regataos-gcs/regataos-wine-base.desktop
update-desktop-database


%files
%defattr(-,root,root,-)
/opt/regataos-wine
/opt/regataos-wine/regataos-wine-service.tar.xz
%{_unitdir}/%{service_name}.service

%changelog
