const Discord = require('discord.js');
const misc = require('./misc.js');
const net = require('./net.js');
const radarr = require('./radarr.js');
const sonarr = require('./sonarr.js');
const { exec } = require('child_process');
const GphApiClient = require('giphy-js-sdk-core');
const { prefix, ownerAuthorID, token, giphyToken } = require('./config.json');

const colors = {
	blue: '#00A1FF',
	red: '#CC0000',
	green: '#39FF5C'
};

const bot = new Discord.Client();
const giphy = GphApiClient(giphyToken);

bot.once('ready', () => {
	console.log('Testy is now online!');
});

bot.on('message', async (message) => {
	if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;
	let command = message.content.split(' ')[0].substr(1);
	if (message.mentions.members !== null || message.mentions.members === undefined) {
		let member = message.mentions.members.first();
	}

	let msg;
	switch (command) {
		case 'sonarr.search':
			sonarr.search(message, colors);
			break;

		case 'sonarr.history.imported':
			sonarr.getImportHistory(message, colors);
			break;

		case 'sonarr.history.deleted':
			sonarr.getDeleteHistory(message, colors);
			break;

		case 'sonarr.info':
			sonarr.getInfo(message, colors);
			break;

		case 'radarr.search':
			radarr.search(message, colors);
			break;

		case 'radarr.history.imported':
			radarr.getImportHistory(message, colors);
			break;

		case 'radarr.history.deleted':
			radarr.getDeleteHistory(message, colors);
			break;

		case 'radarr.info':
			radarr.getInfo(message, colors);
			break;

		case 'net.ping':
			net.ping(message);
			break;

		case 'net.iface.ip.public':
			net.getPublicIP(message, colors);
			break;

		case 'net.iface.ip':
			net.getPrivateIP(message, colors);
			break;

		case 'net.iface.ip.gateway':
			net.getIPGateway(message, colors);
			break;

		case 'net.iface':
			net.getIface(message, colors);
			break;

		case 'whois':
			misc.whois(message, bot, colors);
			break;

		case 'avatar':
			message.reply(message.author.avatar);
			break;

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
			msg = message.content.replace(`${prefix}giphy`, '').trim();
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
	}
});

bot.login(token);
