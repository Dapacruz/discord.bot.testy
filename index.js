const { exec } = require('child_process');
const Discord = require('discord.js');
const GphApiClient = require('giphy-js-sdk-core');
const network = require('network');
const os = require('os');
const sonarr = require('./sonarr.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const { prefix, ownerAuthorID, token, radarrToken, giphyToken } = require('./config.json');
const routerIcon = 'https://i.imgur.com/hF7RRDx.png';
const radarrLogo = 'https://i.imgur.com/BxwzHlD.png';
const blue = '#00A1FF';
const red = '#CC0000';
const green = '#39FF5C';

const bot = new Discord.Client();
const giphy = GphApiClient(giphyToken);

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

		case 'giphy':
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

		case 'sonarr.search':
			sonarr.search(message, blue);
			break;

		case 'sonarr.history.imported':
			sonarr.getImportHistory(message, blue);
			break;

		case 'sonarr.history.deleted':
			sonarr.getDeleteHistory(message, blue);
			break;

		case 'sonarr.info':
			sonarr.getInfo(message, blue);
			break;

		case 'radarr.search':
			var queryIndex = message.content.indexOf(' ') + 1;
			if (queryIndex) {
				query = message.content.slice(queryIndex);
			} else {
				query = '';
			}
			var url = `http://radarr.thecruzs.net/api/movie/?apikey=${radarrToken}`;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url);
			xhr.send();
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var res = JSON.parse(this.responseText);
					var count = 0;
					var results = '';
					res.forEach(function(movie) {
						if (movie.title.match(new RegExp(query, 'i'))) {
							results += `[${movie.title}](http://radarr.thecruzs.net/movies/${movie.titleSlug})\n`;
							count += 1;
						}
					});

					if (count == 0) {
						message.channel.send('No matches found!');
						return;
					}

					const sonarrShows = new Discord.MessageEmbed()
						.setColor(blue)
						.setTitle('Your Movies')
						.setThumbnail(radarrLogo)
						.setDescription(results);
					message.channel.send(sonarrShows).catch(function(err) {
						const tooManyMovies = new Discord.MessageEmbed()
							.setColor(blue)
							.setTitle('Your Movies')
							.setThumbnail(radarrLogo)
							.setDescription(
								'Too many results found\nPlease visit [Radarr](http://radarr.thecruzs.net/)'
							);
						message.channel.send(tooManyMovies);
					});
				}
			};
			break;

		case 'avatar':
			message.reply(message.author.avatar);
			break;

		case 'net.iface.ip.public':
			if (message.author.id === ownerAuthorID) {
				try {
					network.get_public_ip(function(err, ip) {
						var output = err || `${ip}`;
						const publicIP = new Discord.MessageEmbed()
							.setColor(green)
							.setTitle('Public IP Address')
							.setThumbnail(routerIcon)
							.setDescription(`Your public IP address is ${output}`);
						message.channel.send(publicIP);
					});
				} catch (err) {
					console.log(err);
				}
			}
			break;

		case 'net.iface.ip':
			if (message.author.id === ownerAuthorID) {
				try {
					network.get_private_ip(function(err, ip) {
						var output = err || `${ip}`;
						const privateIP = new Discord.MessageEmbed()
							.setColor(green)
							.setTitle('Private IP Address')
							.setThumbnail(routerIcon)
							.setDescription(`Your private IP address is ${output}`);
						message.channel.send(privateIP);
					});
				} catch (err) {
					console.log(err);
				}
			}
			break;

		case 'net.iface.ip.gateway':
			if (message.author.id === ownerAuthorID) {
				try {
					network.get_gateway_ip(function(err, ip) {
						var output = err || `${ip}`;
						const gatewayIP = new Discord.MessageEmbed()
							.setColor(green)
							.setTitle('Gateway Address')
							.setThumbnail(routerIcon)
							.setDescription(`Your gateway address is ${output}`);
						message.channel.send(gatewayIP);
					});
				} catch (err) {
					console.log(err);
				}
			}
			break;

		case 'net.iface':
			if (message.author.id === ownerAuthorID) {
				try {
					network.get_active_interface(function(err, int) {
						var output =
							err ||
							`Type: ${int.name}\nMac Address: ${int.mac_address}\nIP: ${int.ip_address}\nSubnet: ${int.netmask}\nGateway: ${int.gateway_ip}`;
						const interface = new Discord.MessageEmbed()
							.setColor(green)
							.setTitle('Interface Information')
							.setThumbnail(routerIcon)
							.setDescription(output);
						message.channel.send(interface);
					});
				} catch (err) {
					console.log(err);
				}
			}
			break;

		case 'whois':
			if (message.author.id === ownerAuthorID) {
				try {
					let userID = message.content.replace('!whois ', '');
					if (userID === 'undefined') {
						message.channel.send(`${'Invalid user ID!'}`);
					} else {
						let userName = bot.users.fetch(userID);
						message.channel.send(
							`User: ${(await userName).tag}\nUser ID: ${userID}\nAvatar: ${(await userName)
								.avatar}\nhttps://cdn.discordapp.com/app-icons/${userID}/${(await userName).avatar}.png`
						);
					}
				} catch (err) {
					message.channel.send('Invalid user ID!');
				}
			}
			break;
	}
});

bot.login(token);
