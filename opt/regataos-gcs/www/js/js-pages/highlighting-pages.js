// If necessary, display the back button
function back_button() {
	var iframeurl = document.getElementById("iframegcs").contentWindow.location.href

	if ((iframeurl.indexOf("home") > -1) == "1") {
		$(".top-bar-arrow").css("display", "none")
		$("ul#top-menu").css("margin-left", "50px")
		$("a.p-home").css("font-weight", "700")
		$(".text-app").css("font-weight", "400")
	} else {
		$(".top-bar-arrow").css("display", "block")
		$("ul#top-menu").css("margin-left", "80px")
		$("a.p-home").css("font-weight", "400")
	}

	if ((iframeurl.indexOf("installed") > -1) == "1") {
		$("a.p-installed").css("font-weight", "700")
		$(".text-app").css("font-weight", "400")
	} else {
		$("a.p-installed").css("font-weight", "400")
	}

	if ((iframeurl.indexOf("allgames") > -1) == "1") {
		$("a.p-allgames").css("font-weight", "700")
		$(".text-app").css("font-weight", "400")
	} else {
		$("a.p-allgames").css("font-weight", "400")
	}

	if ((iframeurl.indexOf("steam-games") > -1) == "1") {
		$("a.p-steam").css("font-weight", "700")
		$(".text-app").css("font-weight", "400")
	} else {
		$("a.p-steam").css("font-weight", "400")
	}

	if ((iframeurl.indexOf("settings") > -1) == "1") {
		$("a.p-settings").css("font-weight", "700")
		$(".text-app").css("font-weight", "400")
	} else {
		$("a.p-settings").css("font-weight", "400")
	}

	if ((iframeurl.indexOf("search") > -1) == "1") {
		$(".top-bar-arrow").css("display", "block")
		$("ul#top-menu").css("margin-left", "80px")
		$(".text-app").css("font-weight", "400")
	}
}

setInterval(function () {
	back_button();
}, 100);

// If necessary, display the back button per page
function back_button_pages() {
	setTimeout(function () {
		var page_url = document.getElementById("iframegcs").contentWindow.location.href

		if ((page_url.indexOf("games") > -1) == "1") {
			var url_split1 = page_url.split("pages/")[1];
			var pagename = url_split1.replace('-games.html', '');

			$(".text-app").css("font-weight", "400")

			setTimeout(function () {
				$("." + pagename + "-title").css("font-weight", "700")
			}, 100);

		} else if ((page_url.indexOf("gcs") > -1) == "1") {
			var url_split1 = page_url.split("pages/")[1];
			var pagename = url_split1.replace('-gcs.html', '');

			$(".text-app").css("font-weight", "400")

			setTimeout(function () {
				$("." + pagename + "-title").css("font-weight", "700")
			}, 100);

		} else {
			setTimeout(function () {
				$(".text-app").css("font-weight", "400")
			}, 100);
		}
	}, 200);
}
