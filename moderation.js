const Discord = require('discord.js');
const { exec } = require('child_process');

const { ownerAuthorID } = require('./config.json');
const logo = 'https://i.imgur.com/5qQJb1d.png';

module.exports = {
	stopBot,
	restartBot,
	kickUser,
	banUser
};

function stopBot(message) {
	if (message.author.id === ownerAuthorID) {
		try {
			message.channel.send('Testy stopped!').then(() => {
				process.exit(1);
			});
		} catch (err) {
			message.channel.send(err);
		}
	}
}

function restartBot(message) {
	if (message.author.id === ownerAuthorID) {
		message.channel.send('Testy restarted!').then(() => {
			process.exit(1);
		});
		exec('node .', (err, stdout, stderr) => {
			if (err) {
				message.channel.send(err);
			}
		});
	}
}

function kickUser(message, member) {
	if (message.member.hasPermission([ 'KICK_MEMBERS', 'BAN_MEMBERS' ])) {
		member.kick().then((member) => {
			message.channel.send(`:wave: ${member.displayName} has been kicked!`);
		});
	} else {
		message.channel.send('You do not have permission to perform this action!');
	}
}

function banUser(message, member) {
	if (message.member.hasPermission([ 'BAN_MEMBERS' ])) {
		member.ban().then((member) => {
			message.channel.send(`:wave: ${member.displayName} has been banned!`);
		});
	} else {
		message.channel.send('You do not have permission to perform this action!');
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
