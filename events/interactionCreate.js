const { Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { supportServer } = require('../config.json');
const { error } = require('../emojis.json');
const { logger } = require('../util.js');
const { User } = require('../db.js');

const ignoreButton = [];
const ignoreSelectMenu = [];

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {

			User.findOrCreate({
				where: { userid: interaction.user.id },
				defaults: { userid: interaction.user.id }
			}).then(([user, created]) => {
				if (user.banned) {
					interaction.reply({ content: 
						`${error} You are banned from using this service!\n` +
						`You can get unbanned or find out why in the [support server](${supportServer}).`,
						ephemeral: true
					});
					return;
				}
			}).catch((error) => {
				logger.error(error);
			});
			

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				logger.warn(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (e) {
				logger.error(e);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: `${error} There was an error while executing this command!\n`+ 
					`Please report it in the [support server](${supportServer}).\n\nError:\n${e.message}`, ephemeral: true });
				} else {
					await interaction.reply({ content: `${error} There was an error while executing this command!\n` +
					`Please report it in the [support server](${supportServer}).\n\nError:\n${e.message}`, ephemeral: true });
				}
			}
		} else if (interaction.isButton()) {
			// responds to buttons
			if (!ignoreButton.includes(interaction.customId)) {
				const buttonPath = path.join(__dirname, 'button');
				const buttonFiles = fs.readdirSync(buttonPath).filter(file => file.endsWith('.js'));
		
				for (const file of buttonFiles) {
					const filePath = path.join(buttonPath, file);
					const button = require(filePath);
		
					if (button.name === interaction.customId.split('_')[0]) {
						try {
							if (interaction.customId.split('_')[1] == interaction.user.id) {
								await button.execute(interaction);
								return;
							} else {
								interaction.reply({ content: `${error} This is not your button!`, ephemeral: true });
								return;
							}
						} catch (e) {
							interaction.reply({ content: `${error} There was an error while executing this button!\n` +
								`Please report it in the [support server](${supportServer}).\n\nError:\n${e}`, ephemeral: true });
							logger.error(e);
							return;
						}
					}
				}
			}
			interaction.reply({ content: `${error} This button "${interaction.customId.split('_')[0]}" is not registered.`, ephemeral: true });
		} else if (interaction.isStringSelectMenu()) {
			// responds to select menus
			if (!ignoreSelectMenu.includes(interaction.customId)) {
				const selectMenuPath = path.join(__dirname, 'selectMenu');
				const selectMenuFiles = fs.readdirSync(selectMenuPath).filter(file => file.endsWith('.js'));

				for (const file of selectMenuFiles) {
					const filePath = path.join(selectMenuPath, file);
					const selectMenu = require(filePath);
					if (selectMenu.name === interaction.customId.split('_')[0]) {
						try {
							if (interaction.customId.split('_')[1] == interaction.user.id) {
								await selectMenu.execute(interaction);
								return;
							} else {
								interaction.reply({ content: `${error} This is not your select menu!`, ephemeral: true });
								return;
							}
						} catch (e) {
							interaction.reply({ content: `${error} There was an error while executing this select menu!\n` +
								`Please report it in the [support server](${supportServer}).\n\nError:\n${e}`, ephemeral: true });
							logger.error(e);
							return;
						}
					}
				}
			}
			interaction.reply({ content: `${error} This select menu "${interaction.customId.split('_')[0]}" is not registered.`, ephemeral: true });
		} else {
			interaction.reply({ content: `${error} This interaction is not supported.`, ephemeral: true });
		}
	},
};