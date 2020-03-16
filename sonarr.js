const fetch = require('node-fetch');
const Discord = require('discord.js');

const { sonarrToken } = require('./config.json');
const url = 'http://sonarr.thecruzs.net';
const logo = 'https://i.imgur.com/zMUOCnv.png';

module.exports = {
	getInfo,
	search,
	getImportHistory,
	getDeleteHistory
};

function getInfo(message, colors) {
	fetch(`${url}/api/system/status?apikey=${sonarrToken}`)
		.then((res) => {
			if (res.status !== 200) return Promise.reject(`API fetch failed\nStatus code: ${res.status}`);
			return res.json();
		})
		.then((json) => {
			let description = `Version: ${json.version}\nHost OS: ${json.osName}\nOS Version: ${json.osVersion}\nSQLiteVersion: ${json.sqliteVersion}`;
			sendMessage(message, 'Sonarr Information', description, colors.blue);
		})
		.catch((err) => {
			sendMessage(message, 'Sonarr Information', err, colors.red);
		});
}

function search(message, colors) {
	fetch(`${url}/api/series?apikey=${sonarrToken}`)
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
			json.forEach((series) => {
				if (series.title.match(new RegExp(query, 'i'))) {
					results += `[${series.title}](${url}/series/${series.titleSlug})\n`;
					count += 1;
				}
			});

			if (count == 0) {
				sendMessage(message, 'Your Shows', 'No matches found!', colors.red);
				return;
			}
			sendMessage(message, 'Your Shows', results, colors.blue)
				.catch(() => {
					sendMessage(
						message,
						'Your Shows',
						`Too many results found\nPlease visit [Sonarr](${url})`,
						colors.red
					);
				})
				.catch((err) => {
					sendMessage(message, 'Your Movies', err, colors.red);
				});
		});
}

function getImportHistory(message, colors) {
	fetch(`${url}/api/history?pageSize=25&apikey=${sonarrToken}`)
		.then((res) => {
			if (res.status !== 200) return Promise.reject(`API fetch failed\nStatus code: ${res.status}`);
			return res.json();
		})
		.then((json) => {
			let description = '';
			json.records.forEach((series) => {
				if (series.eventType === 'downloadFolderImported') {
					description += `[${series.series.title}](${url}/series/${series.series.titleSlug}) (Season ${series
						.episode.seasonNumber})
                    Episode ${series.episode.episodeNumber} - ${series.episode.title}\n\n`;
				}
			});
			if (description) {
				sendMessage(message, 'Sonarr Completed Downloads', description, colors.blue);
			} else {
				sendMessage(message, 'Sonarr Completed Downloads', 'No recently imported items!', colors.red);
				return;
			}
		})
		.catch((err) => {
			sendMessage(message, 'Sonarr Completed Downloads', err, colors.red);
		});
}

function getDeleteHistory(message, colors) {
	fetch(`${url}/api/history?pageSize=25&apikey=${sonarrToken}`)
		.then((res) => {
			if (res.status !== 200) return Promise.reject(`API fetch failed\nStatus code: ${res.status}`);
			return res.json();
		})
		.then((json) => {
			let description = '';
			json.records.forEach(function(series) {
				if (series.eventType === 'episodeFileDeleted') {
					description += `${series.series.title} (Season ${series.episode.seasonNumber})
                    Episode ${series.episode.episodeNumber} - ${series.episode.title}
                    Reason: ${series.data.reason}\n\n`;
				}
			});
			if (description) {
				sendMessage(message, 'Sonarr Failed Downloads', description, colors.blue);
			} else {
				sendMessage(message, 'Sonarr Failed Downloads', 'No recently deleted items!', colors.red);
			}
		})
		.catch((err) => {
			sendMessage(message, 'Sonarr Failed Downloads', err, colors.red);
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
