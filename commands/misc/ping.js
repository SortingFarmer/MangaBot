const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { embed } = require('../../config.json');
const emoji = require('../../emojis.json');
const { loading } = require('../../util');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong! (And the ping of the bot)')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1]),
	async execute(interaction) {
		const sent = await interaction.reply(loading(false, "Pinging", "Waiting for a response from discord"));
		const timeTaken = sent.createdTimestamp - interaction.createdTimestamp;
		const ping = timeTaken <= 200 ? emoji.goodping : timeTaken <= 1000 ? emoji.middleping : emoji.badping;
		await interaction.editReply({
			content: "",
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
	}
};