#!/bin/sh

# Settings and variables
#General information
app_name="Origin"
app_nickname="origin"
app_name_process="Desinstalar o Origin"
app_remove_status="Desinstalando o Origin..."
app_executable="drive_c/Program Files (x86)/Origin/Origin.exe"

#Default settings
success_removal="Concluído"
success_notify_title="desinstalado com sucesso!"
success_notify_text="foi desinstalado com sucesso."
removal_error="Erro"
removal_error_status="Erro na Desinstalação"
error_notify_title="Erro na desinstalação do"
error_notify_text="Ocorreu algum erro na desinstalação do"
progressbar_dir="/tmp/progressbar-gcs"
app_nickname_dir="$HOME/.local/share/wineprefixes/$app_nickname-compatibility-mode"

# Uninstall app
function remove_app() {
	rm -rf "$app_nickname_dir"
	rm -f "$HOME/.local/share/applications/$app_name.desktop"
	rm -r "$HOME/.local/share/applications/Desinstalar o $app_name.desktop"
	rm -r "$HOME/.local/share/applications/Relatório de erros do $app_name.desktop"
	rm -f $HOME/.config/regataos-gcs/$app_nickname.conf
	rm -f $HOME/.config/regataos-gcs/$app_nickname-games.conf
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
