const { SlashCommandBuilder } = require('discord.js');
const { goodping, middleping, badping } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong! (And the ping of the bot)'),
	async execute(interaction) {
		const timeTaken = Date.now() - interaction.createdTimestamp;
		const ping = timeTaken <= 200 ? goodping : timeTaken <= 1000 ? middleping : badping;
		await interaction.reply({
			content: `Pong! ${ping} \`${timeTaken}ms\``,
			ephemeral: true
		});
	},
};