// For Epic Games Store
let url = window.location.href;

if ((url.indexOf("https://www.epicgames.com/id/login?redirectUrl=https://www.epicgames.com/id/api/redirect") > -1) == "1") {
	console.log("Epic Games Store login screen");

} else if ((url.indexOf("https://www.epicgames.com/id/api/redirect") > -1) == "1") {
	console.log("Account logged into the Epic Games Store. Saving session id for use with legendary.");

	const child = document.querySelector("pre");
	window.opener.postMessage(child.innerHTML, '*');

	setTimeout(function(){
		if (child) {
			window.close();
		}
	}, 100);
}
