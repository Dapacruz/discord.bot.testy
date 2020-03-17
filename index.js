const Discord = require('discord.js');
const misc = require('./misc.js');
const moderation = require('./moderation.js');
const net = require('./net.js');
const radarr = require('./radarr.js');
const sonarr = require('./sonarr.js');
const { prefix, token } = require('./config.json');

const colors = {
	blue: '#00A1FF',
	red: '#CC0000',
	green: '#39FF5C'
};

const bot = new Discord.Client();

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
			moderation.stopBot(message);
			break;

		case 'bot.restart':
			moderation.restartBot(message);
			break;

		case 'kick':
			moderation.kickUser(message, member);
			break;

		case 'ban':
			moderation.banUser(message, member);
			break;

		case 'giphy':
			misc.getGiphy(message);
			break;
	}
});

bot.login(token);
