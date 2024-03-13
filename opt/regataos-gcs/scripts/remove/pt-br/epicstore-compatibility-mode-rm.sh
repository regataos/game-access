#!/bin/sh

# Settings and variables
#General information
app_name="Epic Games Store"
app_nickname="epicstore"
app_name_process="Desinstalar a Epic Games Store"
app_remove_status="Desinstalando a Epic Games Store..."
app_executable="drive_c/Program Files (x86)/Epic Games/Launcher/Portal/Binaries/Win32/EpicGamesLauncher.exe"

#Default settings
success_removal="Concluído"
success_notify_title="desinstalada com sucesso!"
success_notify_text="foi desinstalada com sucesso."
removal_error="Erro"
removal_error_status="Erro na Desinstalação"
error_notify_title="Erro na desinstalação da"
error_notify_text="Ocorreu algum erro na desinstalação da"
progressbar_dir="/tmp/progressbar-gcs"
app_nickname_dir="$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

# Uninstall app
function remove_app() {
	if test ! -e "/tmp/regataos-gcs/config/epicstore-games/show-egs.txt"; then
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
	fi

	rm -f "$HOME/.local/share/applications/Epic Games Launcher.desktop"
	rm -f $HOME/.config/regataos-gcs/$app_nickname.conf
	rm -f $HOME/.config/regataos-gcs/$app_nickname-games.conf
	rm -rf "$HOME/Game Access/$app_name/Epic Games/DirectXRedist"
	rm -rf "$HOME/Game Access/$app_name/Epic Games/Launcher"
	rm -rf "$HOME/Game Access/$app_name/Epic Games(x86)/DirectXRedist"
	rm -rf "$HOME/Game Access/$app_name/Epic Games(x86)/Launcher"
}

# Uninstall failed notify
function success_uninstall() {
	# Notify
	notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$app_name $success_notify_title"
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
rm -f "Epic Games Launcher.desktop"

# Confirm uninstall
if test ! -e "/tmp/regataos-gcs/config/epicstore-games/show-egs.txt"; then
	if test -e "$app_nickname_dir/$app_executable" ; then
		uninstall_failed
	else
		sed -i "s/$app_nickname//" "$HOME/.config/regataos-gcs/installed-launchers.conf"
		sed -i '/^$/d' "$HOME/.config/regataos-gcs/installed-launchers.conf"

		success_uninstall
	fi

else
	sed -i "s/$app_nickname//" "$HOME/.config/regataos-gcs/installed-launchers.conf"
	sed -i '/^$/d' "$HOME/.config/regataos-gcs/installed-launchers.conf"

	success_uninstall
fi
