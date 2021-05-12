// Go pages functions
function gopages() {
const fs = require('fs');
	fs.access("/tmp/regataos-gcs/go-page-auto", (err) => {
	if (!err) {
		var page = fs.readFileSync("/tmp/regataos-gcs/go-page-auto", "utf8");
		var pagename = page.replace(/(\r\n|\n|\r)/gm, "");

		var iframeurl = document.getElementById("iframegcs").contentWindow.location.href
		if ((iframeurl.indexOf(pagename) > -1) == "0") {
			$("#iframegcs").attr("src", "pages/" + pagename + ".html");
			fs.unlinkSync("/tmp/regataos-gcs/go-page-auto");
		}

		if ((pagename.indexOf("-games") > -1) == "1") {
			page = pagename.replace("-games", "");
			$(".text-app").css("font-weight", "400")

			setTimeout(function() {
				$("." + page + "-title").css("font-weight", "700")
			}, 100);

		} else if ((pagename.indexOf("installed") > -1) == "1") {
			setTimeout(function() {
				$("a.p-installed").css("font-weight", "700")
			}, 100);
		}

	return;
	}
	});
}

setTimeout(function(){
	gopages();
}, 1000);
