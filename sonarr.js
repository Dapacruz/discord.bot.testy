const fetch = require('node-fetch');
const Discord = require('discord.js');

const { sonarrToken } = require('./config.json');
const url = 'http://sonarr.thecruzs.net';
const logo = 'https://i.imgur.com/zMUOCnv.png';
const red = '#CC0000';

module.exports = {
	getInfo: getInfo,
	search: search,
	getImportHistory: getImportHistory,
	getDeleteHistory: getDeleteHistory
};

function getInfo(message, color) {
	fetch(`${url}/api/system/status?apikey=${sonarrToken}`)
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			let description = `Version: ${json.version}\nHost OS: ${json.osName}\nOS Version: ${json.osVersion}\nSQLiteVersion: ${json.sqliteVersion}`;
			sendMessage(message, 'Sonarr Information', description, color);
		})
		.catch((err) => {
			sendMessage(message, 'Sonarr Information', err, red);
		});
}

function search(message, color) {
	fetch(`${url}/api/series?apikey=${sonarrToken}`)
		.then((res) => {
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
			json.forEach((series) => {
				if (series.title.match(new RegExp(query, 'i'))) {
					results += `[${series.title}](${url}/series/${series.titleSlug})\n`;
					count += 1;
				}
			});

			if (count == 0) {
				message.channel.send('No matches found!');
				return;
			}
			sendMessage(message, 'Your Shows', results, color).catch(() => {
				sendMessage(message, 'Your Shows', `Too many results found\nPlease visit [Sonarr](${url})`, red);
			});
		});
}

function getImportHistory(message, color) {
	fetch(`${url}/api/history?apikey=${sonarrToken}`)
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			let description;
			json.records.forEach((series) => {
				if (series.eventType === 'downloadFolderImported') {
					description += `${series.series.title} (Season ${series.episode.seasonNumber})
                    Episode ${series.episode.episodeNumber} - ${series.episode.title}\n\n`;
				}
			});
			if (description) {
				sendMessage(message, 'Sonarr Completed Downloads', description, color);
			} else {
				sendMessage(message, 'Sonarr Completed Downloads', 'No recently imported items!', red);
				return;
			}
		})
		.catch((err) => {
			console.error(err);
		});
}

function getDeleteHistory(message, color) {
	fetch(`${url}/api/history?apikey=${sonarrToken}`)
		.then((res) => {
			console.log(res);
			return res.json();
		})
		.then((json) => {
			let description;
			json.records.forEach(function(series) {
				if (series.eventType === 'episodeFileDeleted') {
					description += `${series.series.title} (Season ${series.episode.seasonNumber})
                    Episode ${series.episode.episodeNumber} - ${series.episode.title}
                    Reason: ${series.data.reason}\n\n`;
				}
			});
			if (description) {
				sendMessage(message, 'Sonarr Failed Downloads', description, color);
			} else {
				sendMessage(message, 'Sonarr Failed Downloads', 'No recently deleted items!', red);
			}
		})
		.catch((err) => {
			console.error(err);
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
