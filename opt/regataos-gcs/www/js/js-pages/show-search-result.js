function search_result() {
	const fs = require('fs');

	// Capture search value
	fs.readFile('/tmp/regataos-gcs/search.txt', (err, data) => {
		if (err) throw err;
		const data = data

		// Search Game Access for...
		$(".search-result").text(data);
	});
}

setInterval(function () {
	search_result();
}, 100);
