#!/bin/sh

# Settings and variables
#General information
app_name="Battle.net"
app_nickname="battlenet"
app_name_process="Uninstall Battle.net"
app_remove_status="Uninstalling Battle.net..."
app_executable="drive_c/Program Files (x86)/Battle.net/Battle.net.exe"

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
	if test -e "$HOME/.config/regataos-gcs/external-games-folder.txt"; then
		external_directory_file="$(cat "$HOME/.config/regataos-gcs/external-games-folder.txt")"

		if [[ $(echo $external_directory_file) != *"game-access"* ]]; then
			external_directory="$(echo $external_directory_file)/game-access"
		else
			external_directory="$(echo $external_directory_file)"
		fi

		if test -e "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode"; then
			rm -rf "$(echo $external_directory)/wineprefixes-gcs/$app_nickname-compatibility-mode"
		fi
	fi

	rm -rf "$app_nickname_dir"
	rm -f "$HOME/.local/share/applications/$app_name.desktop"
	rm -f $HOME/.config/regataos-gcs/$app_nickname.conf
	rm -f $HOME/.config/regataos-gcs/$app_nickname-games.conf

	rm -rf "$HOME/Game Access/$app_name/Program Files (x86)/AGEIA Technologies"
	rm -rf "$HOME/Game Access/$app_name/Program Files (x86)/$app_name"
	rm -rf "$HOME/Game Access/$app_name/Program Files (x86)/Common Files"
	rm -rf "$HOME/Game Access/$app_name/Program Files (x86)/Internet Explorer"
	rm -rf "$HOME/Game Access/$app_name/Program Files (x86)/Microsoft.NET"
	rm -rf "$HOME/Game Access/$app_name/Program Files (x86)/NVIDIA Corporation"
	rm -rf "$HOME/Game Access/$app_name/Program Files (x86)/Windows Media Player"
	rm -rf "$HOME/Game Access/$app_name/Program Files (x86)/Windows NT"
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
