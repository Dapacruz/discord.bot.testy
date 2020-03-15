const sonarr = require('./sonarr.js');

sonarr.getInfo();

// fetch(`${sonarrURL}/api/series/?apikey=${sonarrToken}`)
// 	.then((res) => {
// 		return res.json();
// 	})
// 	.then((json) => {
// 		json.forEach((entry) => {
// 			Object.entries(entry).forEach(([ k, v ]) => {
// 				console.log(`${k}: ${v}`);
// 			});
// 		});
// 	})
// 	.catch((err) => {`
// 		console.error(err);
// 	});
