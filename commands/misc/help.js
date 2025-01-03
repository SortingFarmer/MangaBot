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
                `Anything thats in [brackets] is a required argument, anything in (parentheses) is an optional argument.\n` +
                `Any mentions of id's or links are specific to MangaDex.\n`,
                fields: [{
                    name: "Miscellaneous commands",
                    value: `**/help** - Shows this help menu\n` +
                        `**/info** - Provides information about the bot\n` +
                        `**/ping** - Shows the bot's ping\n` +
                        `**/stats** - Shows the bot's statistics\n`,
                }, {
                    name: "Manga commands",
                    value: `**/manga [id/link]** - Displays a manga\n` +
                        `**/follow [id/link]** - Follows a manga\n` +
                        `**/unfollow [id/link]** - Unfollows a manga\n` +
                        `**/list (page number)** - Shows a list of followed manga\n` +
                        `**/latest (page number)** - Shows the latest followed chapters\n` +
                        `**/browse** - Browse some mangas\n` +
                        `**/random (ammount of mangas)** - Shows a random manga\n` +
                        `**/search [name]** - Searches for a manga\n`
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