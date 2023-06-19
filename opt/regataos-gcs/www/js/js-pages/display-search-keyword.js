// Display the keyword in the search result
function display_search_keyword() {
	const fs = require('fs');
	const search_text = fs.readFileSync("/tmp/regataos-gcs/search.txt", "utf8");

	// Search Game Access for...
	document.querySelector(".display-search-keyword").innerHTML = `"${search_text}"`;
}
display_search_keyword();
