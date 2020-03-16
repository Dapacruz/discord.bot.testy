const Discord = require('discord.js');

const { ownerAuthorID } = require('./config.json');
const network = require('network');
const logo = 'https://i.imgur.com/hF7RRDx.png';

module.exports = {
	ping,
	getPublicIP,
	getPrivateIP,
	getIPGateway,
	getIface
};

async function ping(message) {
	msg = await message.channel.send('Pinging ... ');
	msg.edit(`Your latency is ${Math.floor(msg.createdAt - message.createdAt)}ms`);
}

function getPublicIP(message, colors) {
	if (message.author.id === ownerAuthorID) {
		try {
			network.get_public_ip((err, ip) => {
				var output = err || `${ip}`;
				sendMessage(message, 'Public IP Address', `Your public IP address is ${output}`, colors.green);
			});
		} catch (err) {
			sendMessage(message, 'Public IP Address', err, colors.red);
		}
	}
}

function getPrivateIP(message, colors) {
	if (message.author.id === ownerAuthorID) {
		try {
			network.get_private_ip((err, ip) => {
				var output = err || `${ip}`;
				sendMessage(message, 'Private IP Address', `Your private IP address is ${output}`, colors.green);
			});
		} catch (err) {
			sendMessage(message, 'Private IP Address', err, colors.red);
		}
	}
}

function getIPGateway(message, colors) {
	if (message.author.id === ownerAuthorID) {
		try {
			network.get_gateway_ip(function(err, ip) {
				var output = err || `${ip}`;
				sendMessage(message, 'Gateway Address', `Your gateway address is ${output}`, colors.green);
			});
		} catch (err) {
			sendMessage(message, 'Gateway Address', err, colors.red);
		}
	}
}

function getIface(message, colors) {
	if (message.author.id === ownerAuthorID) {
		try {
			network.get_active_interface(function(err, int) {
				var output =
					err ||
					`Type: ${int.name}\nMac Address: ${int.mac_address}\nIP: ${int.ip_address}\nSubnet: ${int.netmask}\nGateway: ${int.gateway_ip}`;
				sendMessage(message, 'Interface Information', output, colors.green);
			});
		} catch (err) {
			sendMessage(message, 'Interface Information', err, colors.red);
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
