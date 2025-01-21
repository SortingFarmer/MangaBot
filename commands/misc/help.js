const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { embed } = require("../../config.json");
const emoji = require("../../emojis.json");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows a list of all commands with their description.")
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1]),

    async execute(interaction) {
        await interaction.reply({
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
			embeds: [{
                title: "Help Menu",
                description: `Below you find a list of all commands that are available and a description of what they do.\n\n` +
                `Anything thats in [brackets] is a required argument, anything in (parentheses) is an optional argument.\n` +
                `Any mentions of id's or links work with only ones from Mangadex.\n`,
                fields: [{
                    name: "Miscellaneous commands",
                    value: `**/help** - Shows this help menu\n` +
                        `**/info** - Provides information about the bot\n` +
                        `**/ping** - Shows the bot's ping\n` +
                        `${emoji.error} **/stats** - Shows the bot's statistics (Not working yet)\n` +
                        `${emoji.error} **/settings** - View and change your settings (Not working yet)\n`,
                }, {
                    name: "Manga commands",
                    value: `**/manga [id/link]** - Displays a manga\n` +
                        `${emoji.error} **/follow [id/link]** - Follows or unfollows a manga (Not working yet)\n` +
                        `${emoji.error} **/list (page number)** - Shows a list of followed manga (Not working yet)\n` +
                        `${emoji.error} **/latest (page number)** - Shows the latest followed chapters (Not working yet)\n` +
                        `${emoji.new.full} **/browse** - Browse some mangas\n` +
                        `${emoji.new.full} **/random** - Shows a random manga\n` +
                        `${emoji.new.full} **/search [name]** - Searches for a manga\n`
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