const { Events, ActivityType } = require('discord.js');
const embed = require('../config.json');
const { logger } = require('../util.js');
const { sequelize } = require('../db.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		logger.info(`Bot is ready! Logged in as ${client.user.tag}`);
        client.user.setActivity({ name: "/help and /info", type: ActivityType.Watching});
		sequelize.authenticate()
			.then(() => {
				logger.info('Connection to database has been established successfully.');
			})
			.catch((error) => {
				logger.error(error);
			});
	}
};