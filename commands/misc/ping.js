const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { embed } = require('../../config.json');
const emoji = require('../../emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong! (And the ping of the bot)'),
	async execute(interaction) {
		const timeTaken = Date.now() - interaction.createdTimestamp;
		const ping = timeTaken <= 200 ? emoji.goodping : timeTaken <= 1000 ? emoji.middleping : emoji.badping;
		await interaction.reply({
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
			embeds: [{
                title: "Pong!",
                description: `The bot's ping is ${ping} ${timeTaken}ms.`,
                color: embed.color,
                footer: {
                    text: embed.footNote,
                    icon_url: `attachment://${embed.logoName}`
                },
                timestamp: new Date().toISOString()
            }],
			ephemeral: false
		});
	},
};