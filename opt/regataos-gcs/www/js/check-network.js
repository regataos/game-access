
// Check internet connection
function check_network() {
    const fs = require('fs');
	fs.readFile('/tmp/apps-scripts/network-status.txt', (err, data) => {
	if (err) throw err;

	var data = data
	var online = "online"
	var offline = "offline"

	var networkon = data.indexOf(online) > -1;
	var networkoff = data.indexOf(offline) > -1;

	if (networkon == '1') {
		$(document).ready(function() {
		$(".main-content").css("display", "block")
		$(".home-blocks").css("display", "block")
		$(".networkoff").css("display", "none")
		});
	} else if (networkoff == '1') {
		$(document).ready(function() {
		$(".main-content").css("display", "none")
		$(".home-blocks").css("display", "none")
		$(".networkoff").css("display", "block")
		});
	}

	});
}

setInterval(function() {
	check_network();
}, 100);
