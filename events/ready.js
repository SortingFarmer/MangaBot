const { Events, ActivityType } = require('discord.js');
const embed = require('../config.json');
const { sequelize } = require('../util.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Bot is ready! Logged in as ${client.user.tag}`);
        client.user.setActivity({ name: "/help and /info", type: ActivityType.Watching});
		sequelize.authenticate()
			.then(() => {
				console.log('Connection to database has been established successfully.');
			})
			.catch((error) => {
				console.error('Unable to connect to the database:', error);
			});
	}
};