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
	notify-send -i emblem-ok-symbolic -u normal -a 'Regata OS Game Access' "$app_name $success_notify_title" "$app_name $success_notify_text"
}

# Uninstall failed notify
function uninstall_failed() {
	# Notify
	notify-send -i emblem-important-symbolic -u normal -a 'Regata OS Game Access' "$error_notify_title $app_name!" "$error_notify_text $app_name."
}

# Search for processes
if test -e "$progressbar_dir/installing" ; then
	# Put the process in the uninstall queue
	echo "$app_nickname=remove process-$app_name_process" >> $progressbar_dir/queued-process

	#I'm in the process queue, see you later
	exit 0
fi

# Start uninstall
rm -f $progressbar_dir/download-percentage
rm -f $progressbar_dir/download-size
rm -f $progressbar_dir/download-speed
rm -f $progressbar_dir/file-size
rm -f $progressbar_dir/eta
rm -f $progressbar_dir/progress

echo "installing" > $progressbar_dir/installing
echo $app_name_process > $progressbar_dir/app-name
echo $app_remove_status > $progressbar_dir/status
echo "installing" > $progressbar_dir/progress-movement
echo "show progress bar" > $progressbar_dir/progressbar

remove_app

# Check desktop and Remove files
test -f "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs" && source "${XDG_CONFIG_HOME:-$HOME/.config}/user-dirs.dirs"
DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"

cd "/$DESKTOP_DIR"
rm -f "$app_name.desktop"

# Confirm uninstall
if test -e "$app_nickname_dir/$app_executable" ; then
	uninstall_failed

	rm -f $progressbar_dir/progress-movement
	rm -f $progressbar_dir/progress-full
	echo $removal_error > $progressbar_dir/progress
	echo $removal_error_status > $progressbar_dir/status

	sleep 5
	rm -f $progressbar_dir/installing

	# If there are no more processes, clear the progress bar cache
	if test ! -e "$progressbar_dir/queued-1" ; then
		rm -f $progressbar_dir/progressbar
		rm -f $progressbar_dir/*
	fi
else
	sed -i "s/$app_nickname//" "$HOME/.config/regataos-gcs/installed-launchers.conf"
	sed -i '/^$/d' "$HOME/.config/regataos-gcs/installed-launchers.conf"

	rm -f $progressbar_dir/progress-movement
	echo "completed" > $progressbar_dir/progress-full
	echo "" > $progressbar_dir/status
	# echo $success_removal > $progressbar_dir/progress

	success_uninstall

	# sleep 5
	rm -f $progressbar_dir/installing

	# If there are no more processes, clear the progress bar cache
	if test ! -e "$progressbar_dir/queued-1" ; then
		rm -f $progressbar_dir/progressbar
		rm -f $progressbar_dir/*
	fi
fi
