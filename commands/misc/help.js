const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { embed } = require("../../config.json");
const emoji = require("../../emojis.json");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows a list of all commands with their description."),

    async execute(interaction) {
        await interaction.reply({
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
			embeds: [{
                title: "Help Menu",
                description: `Below you find a list of all commands that are available and a description of what they do.`,
                fields: [{
                    name: "Miscellaneous commands",
                    value: `**/help** - Shows this help menu\n` +
                        `**/info** - Provides information about the bot\n` +
                        `**/ping** - Shows the bot's ping\n` +
                        `**/** - `,
                }],
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
}