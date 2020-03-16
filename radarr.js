const fetch = require('node-fetch');
const Discord = require('discord.js');

const { radarrToken } = require('./config.json');
const url = 'http://radarr.thecruzs.net';
const logo = 'https://i.imgur.com/BxwzHlD.png';

module.exports = {
	getInfo,
	search,
	getImportHistory,
	getDeleteHistory
};

function getInfo(message, colors) {
	fetch(`${url}/api/system/status?apikey=${radarrToken}`)
		.then((res) => {
			if (res.status !== 200) return Promise.reject(`API fetch failed\nStatus code: ${res.status}`);
			return res.json();
		})
		.then((json) => {
			let description = `Version: ${json.version}\nHost OS: ${json.osName}\nOS Version: ${json.osVersion}\nSQLiteVersion: ${json.sqliteVersion}`;
			sendMessage(message, 'Radarr Information', description, colors.blue);
		})
		.catch((err) => {
			sendMessage(message, 'Radarr Information', err, colors.red);
		});
}

function search(message, colors) {
	fetch(`${url}/api/movie?apikey=${radarrToken}`)
		.then((res) => {
			if (res.status !== 200) return Promise.reject(`API fetch failed\nStatus code: ${res.status}`);
			return res.json();
		})
		.then((json) => {
			let queryIndex = message.content.indexOf(' ') + 1;
			if (queryIndex) {
				query = message.content.slice(queryIndex);
			} else {
				query = '';
			}

			let count = 0;
			let results = '';
			json.forEach((movie) => {
				if (movie.title.match(new RegExp(query, 'i'))) {
					results += `[${movie.title}](${url}/movies/${movie.titleSlug})\n`;
					count += 1;
				}
			});

			if (count == 0) {
				sendMessage(message, 'Your Movies', 'No matches found!', colors.red);
				return;
			}
			sendMessage(message, 'Your Movies', results, colors.blue).catch(() => {
				sendMessage(
					message,
					'Your Movies',
					`Too many results found\nPlease visit [Radarr](${url})`,
					colors.red
				);
			});
		})
		.catch((err) => {
			sendMessage(message, 'Your Movies', err, colors.red);
		});
}

function getImportHistory(message, colors) {
	fetch(`${url}/api/history?page=1&pageSize=25&apikey=${radarrToken}`)
		.then((res) => {
			if (res.status !== 200) return Promise.reject(`API fetch failed\nStatus code: ${res.status}`);
			return res.json();
		})
		.then((json) => {
			let description = '';
			json.records.forEach((movie) => {
				if (movie.eventType === 'downloadFolderImported') {
					description += `[${movie.movie.title}](${url}/movies/${movie.movie.titleSlug})\n`;
				}
			});
			if (description) {
				sendMessage(message, 'Radarr Completed Downloads', description, colors.blue);
			} else {
				sendMessage(message, 'Radarr Completed Downloads', 'No recently imported items!', colors.red);
				return;
			}
		})
		.catch((err) => {
			sendMessage(message, 'Radarr Completed Downloads', err, colors.red);
		});
}

function getDeleteHistory(message, colors) {
	fetch(`${url}/api/history?page=1&pageSize=25&apikey=${radarrToken}`)
		.then((res) => {
			if (res.status !== 200) return Promise.reject(`API fetch failed\nStatus code: ${res.status}`);
			return res.json();
		})
		.then((json) => {
			let description = '';
			json.records.forEach(function(movie) {
				if (movie.eventType === 'episodeFileDeleted') {
					description += `${movie.movie.title}\nReason: ${movie.data.reason}\n\n`;
				}
			});
			if (description) {
				sendMessage(message, 'Radarr Failed Downloads', description, colors.blue);
			} else {
				sendMessage(message, 'Radarr Failed Downloads', 'No recently deleted items!', colors.red);
			}
		})
		.catch((err) => {
			sendMessage(message, 'Radarr Failed Downloads', err, colors.red);
		});
}

function sendMessage(message, title, description, color) {
	return new Promise((resolve, reject) => {
		const embed = new Discord.MessageEmbed()
			.setColor(color)
			.setTitle(title)
			.setThumbnail(logo)
			.setDescription(description);
		message.channel.send(embed).catch(() => {
			reject();
		});
	});
}
