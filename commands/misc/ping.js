const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong! (And the ping of the bot)'),
	async execute(interaction) {
		const timeTaken = Date.now() - interaction.createdTimestamp;
		const ping = timeTaken <= 200 ? '<:goodping:1230818776140742748>' : timeTaken <= 1000 ? '<:idelping:1230818824614445056>' : '<:badping:1230818722348798013>';
		await interaction.reply({
			content: `Pong! ${ping} \`${timeTaken}ms\``,
			ephemeral: true
		});
	},
};