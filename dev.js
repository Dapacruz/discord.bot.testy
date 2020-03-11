const { prefix, token, sonarrToken, giphyToken } = require('./config.json');
const fetch = require('node-fetch');

const sonarrURL = 'http://sonarr.thecruzs.net';

fetch(`${sonarrURL}/api/series/?apikey=${sonarrToken}`)
	.then((response) => {
		if (response.status !== 200) {
			console.log(`Looks like there was a problem. Status Code: ${response.status}`);
			return;
		}

		// response.text().then((data) => console.log(data));

		response.json().then((data) => {
			data.forEach((entry) => {
				Object.entries(entry).forEach(([ k, v ]) => {
					console.log(`${k}: ${v}`);
				});
			});
		});
	})
	.catch((err) => {
		console.log('Fetch Error :-S', err);
	});
