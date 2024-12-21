const { Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { supportServer } = require('../config.json');

const ignoreButton = ["confirm", "cancel"];
const ignoreSelectMenu = [];

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
				console.log(`${interaction.user.tag} ran the command ${interaction.commandName}`);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: `There was an error while executing this command!\n`+ 
					`Please report it in [the support server](${supportServer}).\n\nError:\n${error}`, ephemeral: true });
				} else {
					await interaction.reply({ content: `There was an error while executing this command!\n` +
					`Please report it in [the support server](${supportServer}).\n\nError:\n${error}`, ephemeral: true });
				}
			}
		} else if (interaction.isButton()) {
			console.log(`${interaction.user.tag} clicked the ${interaction.customId} button`);
			// responds to buttons
			if (!ignoreButton.includes(interaction.customId)) {
				const buttonPath = path.join(__dirname, 'button');
				const buttonFiles = fs.readdirSync(buttonPath).filter(file => file.endsWith('.js'));

				for (const file of buttonFiles) {
					const filePath = path.join(buttonPath, file);
					const button = require(filePath);
					if (button.name === interaction.customId) {
						try {
							await button.execute(interaction);
							return;
						} catch (e) {
							interaction.reply({ content: `There was an error while executing this button!\n` +
								`Please report it in [the support server](${supportServer}).\n\nError:\n${e}`, ephemeral: true });
							console.log(e);
							return;
						}
					}
				}
			}
			interaction.reply({ content: 'This button is not registered.', ephemeral: true });
		} else if (interaction.isStringSelectMenu()) {
			console.log(`${interaction.user.tag} used the ${interaction.customId} select menu`);
			// responds to select menus
			if (!ignoreSelectMenu.includes(interaction.customId)) {
				const selectMenuPath = path.join(__dirname, 'selectMenu');
				const selectMenuFiles = fs.readdirSync(selectMenuPath).filter(file => file.endsWith('.js'));

				for (const file of selectMenuFiles) {
					const filePath = path.join(selectMenuPath, file);
					const selectMenu = require(filePath);
					if (selectMenu.name === interaction.customId) {
						try {
							await selectMenu.execute(interaction);
							return;
						} catch (e) {
							interaction.reply({ content: `There was an error while executing this select menu!\n` +
								`Please report it in [the support server](${supportServer}).\n\nError:\n${e}`, ephemeral: true });
							console.log(e);
							return;
						}
					}
				}
			}
			interaction.reply({ content: 'This select menu is not registered.', ephemeral: true });
		}
	},
};