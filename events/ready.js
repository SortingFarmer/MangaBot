const { Events, ActivityType } = require('discord.js');
const embed = require('../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Bot is ready! Logged in as ${client.user.tag}`);
        client.user.setActivity({ name: "/help and /info", type: ActivityType.Watching});
		
	}
};