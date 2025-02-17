// If necessary, display the back button
function back_button() {
	var iframeurl = document.getElementById("iframegcs").contentWindow.location.href

	if ((iframeurl.indexOf("home") > -1) == "1") {
		$(".top-bar-arrow").css("display", "none")
		$("ul#top-menu").css("margin-left", "50px")
		$("a.p-home").addClass('current');
	} else {
		$(".top-bar-arrow").css("display", "block")
		$("ul#top-menu").css("margin-left", "80px")
		$("a.p-home").removeClass('current');
	}

	if ((iframeurl.indexOf("installed") > -1) == "1") {
		$("a.p-installed").addClass('current');
	} else {
		$("a.p-installed").removeClass('current');
	}

	if ((iframeurl.indexOf("allgames") > -1) == "1") {
		$("a.p-allgames").addClass('current');
	} else {
		$("a.p-allgames").removeClass('current');
	}

	if ((iframeurl.indexOf("steam-games") > -1) == "1") {
		$("a.p-steam").addClass('current');
	} else {
		$("a.p-steam").removeClass('current');
	}

	if ((iframeurl.indexOf("settings") > -1) == "1") {
		$("a.p-settings").addClass('current');
	} else {
		$("a.p-settings").removeClass('current');
	}

	if ((iframeurl.indexOf("search") > -1) == "1") {
		$(".top-bar-arrow").css("display", "block")
		$("ul#top-menu").css("margin-left", "80px")
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


			setTimeout(function () {
				$("." + pagename + "-title").addClass('current');
			}, 100);

		} else if ((page_url.indexOf("gcs") > -1) == "1") {
			var url_split1 = page_url.split("pages/")[1];
			var pagename = url_split1.replace('-gcs.html', '');


			setTimeout(function () {
				$("." + pagename + "-title").addClass('current');
			}, 100);

		} else {
			setTimeout(function () {
			}, 100);
		}
	}, 200);
}
