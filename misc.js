const Discord = require('discord.js');

const { ownerAuthorID } = require('./config.json');
const logo = 'https://i.imgur.com/hF7RRDx.png';

module.exports = {
	whois
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
