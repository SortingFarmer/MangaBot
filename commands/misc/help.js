const { SlashCommandBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { embed } = require("../../config.json");
const emoji = require("../../emojis.json");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows the help menu"),
    async execute(interaction) {

        const tickets = new ButtonBuilder()
        tickets.setCustomId('tickets')
        tickets.setLabel('Support ticket')
        type === 'ts' ? tickets.setStyle(ButtonStyle.Success) : tickets.setStyle(ButtonStyle.Primary);
        //type === 'ts' ? tickets.setDisabled(true) : tickets.setDisabled(false);
        tickets.setDisabled(true);
        tickets.setEmoji('1231185397334151218');

        const donate = new ButtonBuilder();
        donate.setCustomId('donate');
        donate.setLabel('Donate');
        donate.setStyle(ButtonStyle.Premium);
        donate.setEmoji(emoji.doller.split(":")[2].remove(">"));

        const serverInvite = new ButtonBuilder();
        const userInvite = new ButtonBuilder();
        const supportServerInvite = new ButtonBuilder();
        const github = new ButtonBuilder();


        await interaction.reply({
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
			embeds: [{
                title: "Help Menu",
                description: "Here you can find all the commands and their descriptions." +

                //Mangadex requires that they get credit for using their API.
                //Icons also requires credit for using their emojis, so I added these notes.
                `\n\nThis bot utilizes *${emoji.mangadex} [MangaDex](https://mangadex.org/about)* to fetch information, chapters, and more about various mangas. The emoji icons used in this bot are created by *${emoji.icons} [Icons](https://discord.gg/aPvvhefmt3)*.`,
                fields: [{
                    name: "Miscellaneous commands",
                    value: `/help - Shows this help menu\n` +
                        `/ping - Shows the bot's ping\n` +
                        `/`,
                }],
                color: embed.color,
                footer: {
                    text: embed.footer,
                    icon_url: `attachment://${embed.logoName}`
                }
            }],
			ephemeral: false
		});
    }
}