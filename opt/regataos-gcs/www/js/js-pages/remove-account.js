// Cancel removing user account
function cancel_remove_account() {
	const exec = require('child_process').exec;

	$('.remove-user-account').css('display', 'none')

	const cancelRemoveAccount = 'rm -f "/tmp/regataos-gcs/remove-user-account-epicstore.txt"';
	exec(cancelRemoveAccount, function (error, call, errlog) {
	});
}

// If necessary, activate the installation confirmation box or run the launcher
function remove_account_epicstore() {
	const exec = require('child_process').exec;
	const fs = require('fs');

	$('.remove-user-account').css('display', 'none')

	const removeFile = 'rm -f "/tmp/regataos-gcs/remove-user-account-epicstore.txt"';
	exec(removeFile, function (error, call, errlog) {
	});

	setTimeout(function () {
		const listLaunchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");

		if ((listLaunchers.indexOf("epicstore") > -1) == "1") {
			const commandLine1 = 'rm -f "/tmp/regataos-gcs/remove-user-account-epicstore.txt"; \
			rm -f "/tmp/regataos-gcs/config/epicstore-games/show-egs.txt"; \
			/opt/regataos-gcs/tools/legendary/legendary auth --delete';
			exec(commandLine1, function (error, call, errlog) {
			});

		} else {
			const commandLine2 = 'rm -f "/tmp/regataos-gcs/remove-user-account-epicstore.txt"; \
			rm -f "/tmp/regataos-gcs/config/epicstore-games/show-egs.txt"; \
			rm -rf "$HOME/.local/share/wineprefixes/epicstore-compatibility-mode"; \
			if test -e "$HOME/.config/regataos-gcs/external-games-folder.txt"; \
			then external_directory_file="$(cat "$HOME/.config/regataos-gcs/external-games-folder.txt")"; \
			if [[ $(echo $external_directory_file) != *"game-access"* ]]; \
			then external_directory="$(echo $external_directory_file)/game-access"; \
			else external_directory="$(echo $external_directory_file)"; fi; \
			if test -e "$(echo $external_directory)/wineprefixes-gcs/epicstore-compatibility-mode"; \
			then rm -rf "$(echo $external_directory)/wineprefixes-gcs/epicstore-compatibility-mode"; fi; fi; \
			/opt/regataos-gcs/tools/legendary/legendary auth --delete';
			exec(commandLine2, function (error, call, errlog) {
			});
		}
	}, 2000);
}
