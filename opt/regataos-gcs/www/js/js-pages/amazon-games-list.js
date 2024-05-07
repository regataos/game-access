// Create the cache with JSON files of games available in the user's Steam account
function createCacheamazonGames() {
	const fs = require("fs");
	const amazonGamesFiles = "/tmp/regataos-gcs/config/amazon-games";

	if (fs.existsSync(`${amazonGamesFiles}/show-games.txt`)) {
		const data = fs.readFileSync(`${amazonGamesFiles}/library.json`, "utf8");
		const amazonGames = JSON.parse(data);

		amazonGames.forEach((games) => {
			const gamename = games.product.title;
			const gameid = games.product.id;
			const gameimg1 = games.product.productDetail.details.screenshots[0];
			const gameimg2 = games.product.productDetail.details.screenshots[1];

			let gamenameLowercase = gamename.toLowerCase()
				.replace(/[-:.,|>()_+®&'()!?™ç]/g, '')
				.replace(/[áàâã]/g, 'a')
				.replace(/[éêẽ]/g, 'e')
				.replace(/í/g, 'i')
				.replace(/[óôõ]/g, 'o')
				.replace(/[üúûũ]/g, 'u');

			gamenameLowercase = gamenameLowercase.replace(/\s+/g, '-');

			// If not, create the games JSON file
			if (!fs.existsSync(`${amazonGamesFiles}/json/${gamenameLowercase}-amazon.json`)) {
				const gamekeywords = gamenameLowercase.replace(/(-)/g, " ");
				console.log("teste: " + gamename, gamenameLowercase);

				const createJsonFile = `[
	{
		"gamename": "${gamename}",
		"gamenickname": "${gamenameLowercase}",
		"gameid": "${gameid}",
		"gametype": "game",
		"game_img1": "${gameimg1}",
		"game_img2": "${gameimg2}",
		"gamekeywords": "${gamename}, ${gamekeywords}, amazon games",
		"launcher": "Amazon Games",
		"launchernickname": "amazon",
		"gamenative": "gcs"
	}
]
`;
				fs.writeFileSync(`${amazonGamesFiles}/json/${gamenameLowercase}-amazon.json`, createJsonFile, "utf8");
				fs.writeFileSync(`/opt/regataos-gcs/games-list/${gamenameLowercase}-amazon.json`, createJsonFile, "utf8");
			}
		});
	}
}
createCacheamazonGames();
