#!/bin/sh

# Settings and variables
#General information
app_name="Rockstar Games Launcher"
app_nickname="rockstar"
app_name_process="Uninstall Rockstar Games Launcher"
app_remove_status="Uninstalling Rockstar Games Launcher..."
app_executable="drive_c/Program Files/Rockstar Games/Launcher/Launcher.exe"

#Default settings
success_removal="Concluded"
success_notify_title="successfully uninstalled!"
success_notify_text="was successfully uninstalled."
removal_error="Error"
removal_error_status="Uninstall error"
error_notify_title="Error in uninstalling"
error_notify_text="There was an error uninstalling"
progressbar_dir="/tmp/progressbar-gcs"
app_nickname_dir="$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

# Uninstall app
function remove_app() {
	rm -rf "$app_nickname_dir"
	rm -f "$HOME/.local/share/applications/$app_name.desktop"
	rm -f $HOME/.config/regataos-gcs/$app_nickname.conf
	rm -f $HOME/.config/regataos-gcs/$app_nickname-games.conf

	rm -rf "$HOME/Game Access/$app_name/Program Files/AGEIA Technologies"
	rm -rf "$HOME/Game Access/$app_name/Program Files/Rockstar Games/Launcher"
	rm -rf "$HOME/Game Access/$app_name/Program Files/Rockstar Games/Social Club"
	rm -rf "$HOME/Game Access/$app_name/Program Files/Common Files"
	rm -rf "$HOME/Game Access/$app_name/Program Files/Internet Explorer"
	rm -rf "$HOME/Game Access/$app_name/Program Files/Microsoft.NET"
	rm -rf "$HOME/Game Access/$app_name/Program Files/NVIDIA Corporation"
	rm -rf "$HOME/Game Access/$app_name/Program Files/Windows Media Player"
	rm -rf "$HOME/Game Access/$app_name/Program Files/Windows NT"
}

# Uninstall failed notify
function success_uninstall() {
	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$app_name $success_notify_title" "$app_name $success_notify_text"
}

# Uninstall failed notify
function uninstall_failed() {
	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$error_notify_title $app_name!" "$error_notify_text $app_name."
}

(
	remove_app
) | env GTK_THEME=Adwaita:dark zenity --progress --pulsate --width 350 --window-icon "/usr/share/pixmaps/regataos-gcs.png" \
--title "Regata OS Game Access" \
--text "$app_remove_status" \
--auto-close --auto-kill --no-cancel

# Check desktop and Remove files
test -f "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs" && source "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs"
DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"

cd "/$DESKTOP_DIR"
rm -f "$app_name.desktop"

# Confirm uninstall
if test -e "$app_nickname_dir/$app_executable" ; then
	uninstall_failed
else
	sed -i "s/$app_nickname//" "$HOME/.config/regataos-gcs/installed-launchers.conf"
	sed -i '/^$/d' "$HOME/.config/regataos-gcs/installed-launchers.conf"

	success_uninstall
fi
