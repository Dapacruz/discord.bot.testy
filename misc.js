const Discord = require('discord.js');
const GphApiClient = require('giphy-js-sdk-core');
const { prefix, ownerAuthorID, giphyToken } = require('./config.json');

const logo = 'https://i.imgur.com/5qQJb1d.png';

const giphy = GphApiClient(giphyToken);

module.exports = {
	whois,
	getGiphy
};

async function whois(message, bot, colors) {
	if (message.author.id === ownerAuthorID) {
		try {
			let userIDIndex = message.content.indexOf(' ') + 1;
			if (userIDIndex) {
				userID = message.content.slice(userIDIndex);
			}
			if (userID === 'undefined') {
				sendMessage(message, 'Whois Info', 'Invalid user ID!', colors.red);
			} else {
				let userName = bot.users.fetch(userID);
				sendMessage(
					message,
					'Whois Info',
					`User: ${(await userName).tag}\nUser ID: ${userID}\nAvatar: ${(await userName)
						.avatar}\nhttps://cdn.discordapp.com/app-icons/${userID}/${(await userName).avatar}.png`,
					colors.green
				);
			}
		} catch (err) {
			sendMessage(message, 'Whois Info', err, colors.red);
		}
	}
}

function getGiphy(message) {
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
