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
                description: `Below you find a list of all commands that are available and a description of what they do.\n` +
                `Anything thats in [brackets] is a required argument, anything in (parentheses) is an optional argument.\n`,
                fields: [{
                    name: "Miscellaneous commands",
                    value: `**/help** - Shows this help menu\n` +
                        `**/info** - Provides information about the bot\n` +
                        `**/ping** - Shows the bot's ping\n` +
                        `**/version** - Shows the bot's version\n` +
                        `**/invite** - Shows the invite link for the bot\n` +
                        `**/stats** - Shows the bot's statistics\n`,
                }, {
                    name: "Manga commands",
                    value: `**/manga [id]** - Displays a manga\n` +
                        `**/chapter [id]** - Searches for a chapter\n` +
                        `**/follow [id]** - Follows a manga\n` +
                        `**/list (page number)** - Shows a list of followed manga\n` +
                        `**/unfollow [id]** - Unfollows a manga\n` +
                        `**/latest (page number)** - Shows the latest chapters\n` +
                        `**/random (ammount of mangas)** - Shows a random manga\n` +
                        `**/search [name]** - Searches for a manga\n` +
                        `**/top (number of mangas)** - Shows the top rated manga\n`
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