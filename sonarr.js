const fetch = require('node-fetch');
const Discord = require('discord.js');

const { sonarrToken } = require('./config.json');
const url = 'http://sonarr.thecruzs.net';
const logo = 'https://i.imgur.com/zMUOCnv.png';

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
			const embed = new Discord.MessageEmbed()
				.setColor(color)
				.setTitle('Sonarr Information')
				.setThumbnail(logo)
				.setDescription(description);
			message.channel.send(embed);
		})
		.catch((err) => {
			console.error(err);
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

			const embed = new Discord.MessageEmbed()
				.setColor(color)
				.setTitle('Your Shows')
				.setThumbnail(logo)
				.setDescription(results);
			message.channel.send(embed).catch((err) => {
				const embed = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('Your Shows')
					.setThumbnail(logo)
					.setDescription(`Too many results found\nPlease visit [Sonarr](${url})`);
				message.channel.send(embed);
			});
		})
		.catch((err) => {
			console.error(err);
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
				const embed = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('Sonarr Completed Downloads')
					.setThumbnail(logo)
					.setDescription(description);
				message.channel.send(embed);
			} else {
				message.channel.send('No recently imported items!');
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
				const embed = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('Sonarr Failed Downloads')
					.setThumbnail(logo)
					.setDescription(description);
				message.channel.send(embed);
			} else {
				message.channel.send('No recently deleted items!');
			}
		})
		.catch((err) => {
			console.error(err);
		});
}
