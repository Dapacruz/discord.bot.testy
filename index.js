const {
	exec
} = require('child_process');

const { prefix, ownerAuthorID, token, sonarrToken, giphyToken } = require('./config.json');

const Discord = require('discord.js');
const bot = new Discord.Client();

const GphApiClient = require('giphy-js-sdk-core');
const giphy = GphApiClient(giphyToken);

const sonarrLogo = 'https://i.imgur.com/tQZLr55.png';
const colorBlue = '#00A1FF';
const colorRed = '#CC0000';
const colorGreen = '#39FF5C';


bot.once('ready', () => {
	console.log('Testy is now online!');
});

bot.on('message', async (message) => {
	let member = message.mentions.members.first();
	let command = message.content.split(' ')[0].substr(1);

	let msg;
	switch (command) {
		case 'bot.stop':
			if (message.author.id === ownerAuthorID) {
				try {
					message.channel.send('Testy stopped!').then(() => {
						process.exit(1);
					});
				} catch (err) {
					return;
				}
			}
			break;

		case 'bot.restart':
			if (message.author.id === ownerAuthorID) {
				message.channel.send('Testy restarted!').then(() => {
					process.exit(1);
				});
				exec('node .', (err, stdout, stderr) => {
					if (err) {
						return;
					}
				});
			}
			break;

		case 'ping':
			msg = await message.channel.send('Pinging ... ');
			msg.edit(`Your latency is ${Math.floor(msg.createdAt - message.createdAt)}ms`);
			break;

		case 'kick':
			if (message.member.hasPermission([ 'KICK_MEMBERS', 'BAN_MEMBERS' ])) {
				member.kick().then((member) => {
					message.channel.send(`:wave: ${member.displayName} has been kicked!`);
				});
			} else {
				message.channel.send('You do not have permission to perform this action!');
			}
			break;

		case 'ban':
			if (message.member.hasPermission([ 'BAN_MEMBERS' ])) {
				member.ban().then((member) => {
					message.channel.send(`:wave: ${member.displayName} has been banned!`);
				});
			} else {
				message.channel.send('You do not have permission to perform this action!');
			}
			break;

		case 'gif':
			msg = message.content.replace(`${prefix}gif`, '').trim();
			if (msg) {
				try {
					giphy.search('gifs', { q: msg }).then((response) => {
						var totalResponses = response.data.length;
						var responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses;
						var responseFinal = response.data[responseIndex];
						if (responseFinal) {
							message.channel.send({ files: [ responseFinal.images.fixed_height.url ] });
						} else {
							message.channel.send('Gif not found!');
						}
					});
				} catch (err) {
					message.channel.send(err);
				}
			} else {
				message.channel.send('Huh?');
			}
			break;

			case 'sonarr.show':
				var query = message.content.slice(13);
				var url = `http://sonarr.thecruzs.net/api/series/?apikey=${sonarrToken}`;
				var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
				var xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.send();
				xhr.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						var res = JSON.parse(this.responseText);
						var count = 0;
						var results = '';
						res.forEach(function (show) {
							if (show.title.match(new RegExp(query, "i"))) {
								results += "[" + show.title + "](http://sonarr.thecruzs.net/series/" + show.title.replace(/\s/g, "-").replace(/[()]/g, "").toLowerCase() + ")\n"
								count += 1;
							}
						});

						if (count == 0) {
							message.channel.send('No matches found!');
							return;
						}

							const sonarrShows = new Discord.MessageEmbed()
								.setColor(colorBlue)
								.setTitle('Your Shows')
								.setThumbnail(sonarrLogo)
								.setDescription(results);
							message.channel.send(sonarrShows)
							.catch(function (err) {
								const tooManyShows = new Discord.MessageEmbed()
									.setColor(colorBlue)
									.setTitle('Your Shows')
									.setThumbnail(sonarrLogo)
									.setDescription("Too many results found. Please visit [Sonarr](http://sonarr.thecruzs.net/)");
								message.channel.send(tooManyShows);
							});
					}
	
				};
				break;

			case 'sonarr.history':
				var url = `http://sonarr.thecruzs.net/api/history/?apikey=${sonarrToken}`;
				var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
				var xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.send();
				xhr.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						var foo = JSON.parse(this.responseText);
						let description = '';
						foo.records.forEach(function (values) {
							if (values.eventType === 'downloadFolderImported') {
								console.log(`${values.series.title} (Season ${values.episode.seasonNumber})`);
								console.log(`Episode ${values.episode.episodeNumber} - ${values.episode.title}`);
								description += `${values.series.title} (Season ${values.episode.seasonNumber})
								Episode ${values.episode.episodeNumber} - ${values.episode.title}\n\n`;
							}
						});
						const sonarrDownloads = new Discord.RichEmbed()
							.setColor(colorBlue)
							.setTitle('Sonarr Completed Downloads')
							.setThumbnail(sonarrLogo)
							.setDescription(description);
						message.channel.send(sonarrDownloads);
					}
				};
				break;

			case 'sonarr.info':
				var url = `http://sonarr.thecruzs.net/api/system/status?apikey=${sonarrToken}`;
				var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
				var xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.send();
				xhr.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						var foo = JSON.parse(this.responseText);
						let description = '';
						console.log(foo);
						description += `Version: ${foo.version}\nHost OS: ${foo.osName}\nOS Version: ${foo.osVersion}\nSQLiteVersion: ${foo.sqliteVersion}`;
						const sonarrInfo = new Discord.RichEmbed()
							.setColor(colorBlue)
							.setTitle('Sonarr Information')
							.setThumbnail(sonarrLogo)
							.setDescription(description);
						message.channel.send(sonarrInfo);
					}
				};
				break;
		}
});

bot.login(token);
