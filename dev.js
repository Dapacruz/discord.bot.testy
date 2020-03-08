// const { prefix, token, sonarrToken, giphyToken } = require('./config.json');

// fetch(`http://sonarr.thecruzs.net/api/system/status?apikey=${sonarrToken}`)
// 	.then((response) => {
// 		if (response.status !== 200) {
// 			console.log('Looks like there was a problem. Status Code: ' + response.status);
// 			return;
// 		}

// 		// Examine the text in the response
// 		response.json().then((data) => {
// 			console.log(data);
// 		});
// 	})
// 	.catch((err) => {
// 		console.log('Fetch Error :-S', err);
// 	});

let str = "The Witcher"
console.log(str.match(/witcher/ig) ? str : '')
