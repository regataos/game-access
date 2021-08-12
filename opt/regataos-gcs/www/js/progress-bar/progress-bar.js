const exec = require('child_process').exec;
const fs = require('fs');

// folder with the file with the value
var dir = "/tmp/progressbar-gcs/"

// Close confirm box
function show_confirmbox() {
    var command_line = "echo showconfirmbox > "+dir+"confirm-cancel-installation";
    //console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

// If prompted, pause download
function down_paused() {
    var command_line = "echo downpaused > "+dir+"down-paused";
    //console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });

	fs.readFile(dir+'wget-pid', (err, wgetpid) => {
	if (err) throw err;
	//console.log(wgetpid);
	var wgetpid = wgetpid

    var command_line = "kill -STOP "+wgetpid;
    //console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });

	});

	fs.readFile(dir+'legendary-pid', (err, legendary_pid) => {
	if (err) throw err;
	//console.log(wgetpid);
	var legendary_pid = legendary_pid

    var command_line = "pkill --signal STOP "+legendary_pid;
    //console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });

	});
}

function down_started() {
	var command_line = "rm -f "+dir+"down-paused";
    //console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });

	fs.readFile(dir+'wget-pid', (err, wgetpid) => {
	if (err) throw err;
	//console.log(wgetpid);
	var wgetpid = wgetpid

    var command_line = "kill -CONT "+wgetpid;
    //console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });

	});

	fs.readFile(dir+'legendary-pid', (err, legendary_pid) => {
	if (err) throw err;
	//console.log(wgetpid);
	var legendary_pid = legendary_pid

    var command_line = "pkill --signal CONT "+legendary_pid;
    //console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });

	});
}

function pause_down() {
fs.access(dir+'down-paused', (err) => {
if (!err) {
	$(".play").css("display", "none")
	$(".pause").css("display", "block")
	down_started();
	return;
} else {
	$(".pause").css("display", "none")
	$(".play").css("display", "block")
	down_paused();
}
});
}

// When prompted, display full progress bar
function show_barfull() {
    var command_line = "echo full > "+dir+"show-barfull";
    //console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

function full_progressbar() {
fs.access(dir+'show-barfull', (err) => {
if (!err) {

	$(".more-info").css("display", "block")
	$(".more-info2").css("display", "none")

	var command_line = "rm -f "+dir+"show-barfull";
    //console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });

	return;
} else {
	$(".progress-bar-full").css("display", "block")
	$(".more-info2").css("display", "block")
	$(".more-info").css("display", "none")
	show_barfull();
}
});
}

function full_progressbar2() {
fs.access(dir+'show-barfull', (err) => {
if (!err) {
	$(".progress-bar-full").css("display", "block")
	$(".more-info").css("display", "none")
	$(".more-info2").css("display", "block")
	return;
} else {
	$(".more-info2").css("display", "none")
	$(".more-info").css("display", "block")
}
});
}

// make the progress bar move according to the current progress of the running process
function app_name() {

fs.readFile(dir+'app-name', (err, appname) => {
  if (err) throw err;
  //console.log(appname);

  var app = appname

  $(".app-installing").text(app);
});

}

function progress() {

fs.readFile(dir+'progress', (err, percentage) => {
  if (err) throw err;
  //console.log(percentage);

  var valor = percentage

  $(".progress").css("width", valor)
  $(".percentage").text(valor);
});

}

function status() {

fs.readFile(dir+'status', (err, status) => {
  if (err) throw err;
  //console.log(status);

  var status = status

  $(".status").text(status);
});

}

function down_speed() {
fs.access(dir+'speed', (err) => {
if (!err) {

	$(".down-speed").css("display", "block")
	$(".down-file-size").css("display", "block")
	$(".eta-info").css("display", "block")

	fs.access(dir+'down-paused', (err) => {
	if (!err) {
		$(".pause").css("display", "none")
		$(".play").css("display", "block")
	return;
	} else {
		$(".play").css("display", "none")
		$(".pause").css("display", "block")
	}
	});

	fs.access(dir+'script-cancel', (err) => {
	if (!err) {
		$(".cancel").css("display", "block")
		$(".cancel").css("margin-top", "0px")
	return;
	} else {
		$(".cancel").css("display", "none")
	}
	});

	fs.readFile(dir+'speed', (err, speed) => {
	if (err) throw err;
	//console.log(speed);

		var speed = speed

		$(".down-speed2").text(speed);
	});

	return;
} else {
	$(".down-speed").css("display", "none")
	$(".down-file-size").css("display", "none")
	$(".eta-info").css("display", "none")
	$(".play").css("display", "none")
	$(".pause").css("display", "none")

	fs.access(dir+'script-cancel', (err) => {
	if (!err) {
		$(".cancel").css("display", "block")
		$(".cancel").css("margin-top", "20px")
	return;
	} else {
		$(".cancel").css("display", "none")
	}
	});

}
});
}

function down_size() {
	fs.access(dir+'download-size-bytes', (err) => {
	if (!err) {
		fs.readFile(dir+'download-size-bytes', (err, downsize_bytes) => {
  		if (err) throw err;
  			var downsize_bytes = downsize_bytes

			function formatBytes(bytes, decimals = 2) {
			if (bytes == 0) return '0 Bytes';
				const k = 1024;
				const dm = decimals < 0 ? 0 : decimals;
				const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

				const i = Math.floor(Math.log(bytes) / Math.log(k));

				return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
			}

  			$("#downsize").text(formatBytes(downsize_bytes));
		});
	return;

	} else {
		fs.readFile(dir+'download-size', (err, downsize) => {
		if (err) throw err;
			var downsize = downsize
			$("#downsize").text(downsize);
		});
	}
	});
}

function file_size() {
	fs.access(dir+'file-size-bytes', (err) => {
	if (!err) {
		fs.readFile(dir+'file-size-bytes', (err, filesize_bytes) => {
  		if (err) throw err;
  			var filesize_bytes = filesize_bytes

			function formatBytes(bytes, decimals = 2) {
			if (bytes == 0) return '0 Bytes /';
				const k = 1024;
				const dm = decimals < 0 ? 0 : decimals;
				const sizes = ['Bytes /', 'KB /', 'MB /', 'GB /', 'TB /', 'PB /', 'EB /', 'ZB /', 'YB /'];

				const i = Math.floor(Math.log(bytes) / Math.log(k));

				return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
			}

  			$("#filesize").text(formatBytes(filesize_bytes));
		});
	return;

	} else {
		fs.readFile(dir+'file-size', (err, filesize) => {
		if (err) throw err;
			var filesize = filesize
			$("#filesize").text(filesize);
		});
	}
	});
}

function eta_down() {

fs.readFile(dir+'eta', (err, eta) => {
  if (err) throw err;
  //console.log(eta);

  var eta = eta

  $("#eta").text(eta);
});

}

// If necessary, display the moving bar or full bar
function progress_movement() {
fs.access(dir+'progress-movement', (err) => {
if (!err) {
	$(".progress-movement").css("display", "block")
	$(".progress").css("display", "none")
	$(".progress-full").css("display", "none")
	$(".percentage").css("display", "block")
	$(".light-greyfull").css("display", "none")
	$(".app-installingfull").css("margin-bottom", "5px")
	return;
} else {

	fs.access(dir+'progress-full', (err) => {
	if (!err) {
		$(".progress-full").css("display", "block")
		$(".percentage").css("display", "block")
		$(".progress-movement").css("display", "none")
		$(".progress").css("display", "none")
		$(".light-greyfull").css("display", "block")
		$(".app-installingfull").css("margin-bottom", "15px")
		return;
	} else {
		$(".progress-movement").css("display", "none")
		$(".progress-full").css("display", "none")
		$(".progress").css("display", "block")
		$(".percentage").css("display", "block")
		$(".light-greyfull").css("display", "block")
		$(".app-installingfull").css("margin-bottom", "15px")
	}
	});

}
});
}

// Check process queue and sort by sequence
function check_queue() {

fs.access(dir+'queued-1', (err) => {
if (!err) {
console.error('myfile already exists');

	$(".more-info").css("background-image", 'url("../images/arrow-right-on.png")')
	$(".queued-block").css("display", "block")

	return;
} else {
	$(".more-info").css("background-image", 'url("../images/arrow-right-off.png")')
	$(".queued-block").css("display", "none")
}
});

}

function queued1() {

fs.access(dir+'queued-1', (err) => {
if (!err) {
console.error('myfile already exists');

	fs.readFile(dir+'queued-1', (err, queued1) => {
	if (err) throw err;
		//console.log(queued1);
		var app1 = queued1
		$("#queued-1").css("display", "block")
		$("#queued-1 .queued-title").text(app1);
	});

	return;
} else {
	$("#queued-1").css("display", "none")
}
});

}

function queued2() {

fs.access(dir+'queued-2', (err) => {
if (!err) {
console.error('myfile already exists');

	fs.readFile(dir+'queued-2', (err, queued2) => {
	if (err) throw err;
		//console.log(queued2);
		var app2 = queued2
		$("#queued-2").css("display", "block")
		$("#queued-2 .queued-title").text(app2);
	});

	return;
} else {
	$("#queued-2").css("display", "none")
}
});

}

function queued3() {

fs.access(dir+'queued-3', (err) => {
if (!err) {
console.error('myfile already exists');

	fs.readFile(dir+'queued-3', (err, queued3) => {
	if (err) throw err;
		//console.log(queued3);
		var app3 = queued3
		$("#queued-3").css("display", "block")
		$("#queued-3 .queued-title").text(app3);
	});

	return;
} else {
	$("#queued-3").css("display", "none")
}
});

}

function queued4() {

fs.access(dir+'queued-4', (err) => {
if (!err) {
console.error('myfile already exists');

	fs.readFile(dir+'queued-4', (err, queued4) => {
	if (err) throw err;
		//console.log(queued4);
		var app4 = queued4
		$("#queued-4").css("display", "block")
		$("#queued-4 .queued-title").text(app4);
	});

	return;
} else {
	$("#queued-4").css("display", "none")
}
});

}

function queued5() {

fs.access(dir+'queued-5', (err) => {
if (!err) {
console.error('myfile already exists');

	fs.readFile(dir+'queued-5', (err, queued5) => {
	if (err) throw err;
		//console.log(queued5);
		var app5 = queued5
		$("#queued-5").css("display", "block")
		$("#queued-5 .queued-title").text(app5);
	});

	return;
} else {
	$("#queued-5").css("display", "none")
}
});

}

function queued6() {

fs.access(dir+'queued-6', (err) => {
if (!err) {
console.error('myfile already exists');

	fs.readFile(dir+'queued-6', (err, queued6) => {
	if (err) throw err;
		//console.log(queued6);
		var app6 = queued6
		$("#queued-6").css("display", "block")
		$("#queued-6 .queued-title").text(app6);
	});

	return;
} else {
	$("#queued-6").css("display", "none")
}
});

}

function queued7() {

fs.access(dir+'queued-7', (err) => {
if (!err) {
console.error('myfile already exists');

	fs.readFile(dir+'queued-7', (err, queued7) => {
	if (err) throw err;
		//console.log(queued7);
		var app7 = queued7
		$("#queued-7").css("display", "block")
		$("#queued-7 .queued-title").text(app7);
	});

	return;
} else {
	$("#queued-7").css("display", "none")
}
});

}

function queued8() {

fs.access(dir+'queued-8', (err) => {
if (!err) {
console.error('myfile already exists');

	fs.readFile(dir+'queued-8', (err, queued8) => {
	if (err) throw err;
		//console.log(queued8);
		var app8 = queued8
		$("#queued-8").css("display", "block")
		$("#queued-8 .queued-title").text(app8);
	});

	return;
} else {
	$("#queued-8").css("display", "none")
}
});

}

setInterval(function() {
	progress();
	progress_movement();
	app_name();
	status();
	down_speed();
	down_size();
	file_size();
	eta_down();
	check_queue();
	full_progressbar2();
	queued1();
	queued2();
	queued3();
	queued4();
	queued5();
	queued6();
	queued7();
	queued8();
}, 500);
