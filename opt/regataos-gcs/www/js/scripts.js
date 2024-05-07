// Check the page url and check the user login.
let url = window.location.href;

// For Epic Games Store
if (url.includes("https://www.epicgames.com/id/login?redirectUrl=https://www.epicgames.com/id/api/redirect")) {
	console.log("Epic Games Store login screen");

} else if (url.includes("https://www.epicgames.com/id/api/redirect")) {
	console.log("Account logged into the Epic Games Store. Saving session id for use with legendary.");

	const child = document.querySelector("pre");
	window.opener.postMessage(child.innerHTML, '*');

	setTimeout(function(){
		if (child) {
			window.close();
		}
	}, 100);
}

// For Amazon Games
if (url.includes("https://www.amazon.com/ap/signin")) {
	console.log("Amazon Games login screen");

} else if (url.includes("https://www.amazon.com/?openid.assoc_handle")) {
	console.log("Account logged into the Amazon Games. Saving session id for use with nile tool.");

	const pageUrl = window.location.href;
	const parameters = pageUrl.split("&");

	let authorizationCode;
	parameters.forEach(parameter => {
		if (parameter.includes("openid.oa2.authorization_code=")) {
			authorizationCode = parameter.split("=")[1];
		}
	});

	window.opener.postMessage(authorizationCode, "*");

	setTimeout(function(){
		if (authorizationCode) {
			window.close();
		}
	}, 100);
}
