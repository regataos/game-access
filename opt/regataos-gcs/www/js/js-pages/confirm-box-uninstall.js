// Confirm launcher installation
function uninstall_app() {
    const exec = require('child_process').exec;

	var iframeurl = document.getElementById("iframegcs").contentWindow.location.href
    var url_split1 = iframeurl.split("pages/")[1];
    var pagename = url_split1.replace('-games.html', '');

	var command_line = 'echo "' + pagename + '" > "/tmp/regataos-gcs/confirm-uninstall"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}
