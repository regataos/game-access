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
			/opt/regataos-gcs/tools/legendary/legendary auth --delete';
			exec(commandLine2, function (error, call, errlog) {
			});
		}
	}, 2000);
}
