// Search
function search() {
	const fs = require('fs');
	const form = document.getElementById('form');
	const field = document.getElementById('field');

	form.addEventListener('submit', function (e) {
		// Capture the search
		const data = field.value
		$('#field').val("");

		let data2 = data.toLowerCase();
		// data2 = data2.replace(/\s/g, '');
		data2 = data2.replace(/'/g, '');
		data2 = data2.replace(/(ç)/g, 'c');
		data2 = data2.replace(/(á)|(â)|(ã)|(à)/g, 'a');
		data2 = data2.replace(/(é)|(ê)|(ẽ)/g, 'e');
		data2 = data2.replace(/(í)/g, 'i');
		data2 = data2.replace(/(ó)|(ô)|(ô)/g, 'o');
		data2 = data2.replace(/(ú)|(û)|(ũ)/g, 'u');

		fs.writeFileSync("/tmp/regataos-gcs/search.txt", data2, "utf8");

		// Go search page
		$("#iframegcs").attr("src", "pages/search.html");

		// Prevent form submission
		e.preventDefault();
	});
}
search();
