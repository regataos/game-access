// Cancel removing user account
function cancel_remove_account() {
const exec = require('child_process').exec;

	$('.remove-user-account').css('display', 'none')

	var command_line = 'rm -f "/tmp/regataos-gcs/remove-user-account-epicstore.txt"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

// If necessary, activate the installation confirmation box or run the launcher
function remove_account_epicstore() {
const exec = require('child_process').exec;

	$('.remove-user-account').css('display', 'none')

	var command_line = 'rm -f "/tmp/regataos-gcs/remove-user-account-epicstore.txt"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});

	setTimeout(function(){
		var command_line = 'rm -f "/tmp/regataos-gcs/remove-user-account-epicstore.txt"; \
		rm -f "/tmp/regataos-gcs/config/epicstore-games/show-egs.txt"; \
		rm -rf "$HOME/.local/share/wineprefixes/epicstore-compatibility-mode"\
		/opt/regataos-gcs/scripts/remove/scripts-remove/epicstore-compatibility-mode-rm.sh start"\
		/opt/regataos-gcs/tools/legendary/legendary auth --delete';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});
	}, 2000);
}
