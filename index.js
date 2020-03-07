const { prefix, token, giphyToken } = require('./config.json');

const Discord = require('discord.js');
const bot = new Discord.Client();

const GphApiClient = require('giphy-js-sdk-core');
const giphy = GphApiClient(giphyToken);

bot.once('ready', () => {
	console.log('Testy is now online!');
});

bot.on('message', async (message) => {
	let member = message.mentions.members.first();
	let command = message.content.split(' ')[0].substr(1);

	let msg;
	switch (command) {
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
			msg = message.content.replace(`${prefix}gif`, '');
			msg = msg.trim();
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
