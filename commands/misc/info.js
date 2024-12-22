const { SlashCommandBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { embed, name, invite, supportServer, github, owner } = require("../../config.json");
const emoji = require("../../emojis.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides information about the bot.'),

    async execute(interaction) {
        const donate = new ButtonBuilder();
        donate.setCustomId('support');
        donate.setLabel('Donation options');
        donate.setStyle(ButtonStyle.Secondary);
        donate.setEmoji(emoji.doller);

        const serverInvite = new ButtonBuilder();
        serverInvite.setLabel('Invite bot');
        serverInvite.setStyle(ButtonStyle.Link);
        serverInvite.setURL(invite);

        const supportServerInvite = new ButtonBuilder();
        supportServerInvite.setLabel('Support Server');
        supportServerInvite.setStyle(ButtonStyle.Link);
        supportServerInvite.setURL(supportServer);

        const githubLink = new ButtonBuilder();
        githubLink.setLabel('GitHub');
        githubLink.setStyle(ButtonStyle.Link);
        githubLink.setURL(github);


        const row = new ActionRowBuilder();
        row.addComponents(donate, serverInvite, supportServerInvite, githubLink);


        await interaction.reply({
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
			embeds: [{
                title: "Informations Menu",
                description: `Introducing ${name}, a versatile bot designed to enhance your manga reading experience. With ${name}, you can effortlessly search for your favorite manga titles and discover new ones using a variety of filters. Create personalized lists of the manga you love and follow them to receive notifications whenever a new chapter is released.` +
                `\n\n${name} can be seamlessly integrated into your server, where it will post updates in a designated channel whenever new manga chapters are available. Additionally, you have the option to add ${name} to your user apps, allowing you to access its features and look up manga from anywhere, at any time.` + 
                `\n\nExperience the convenience and excitement of staying up-to-date with your favorite manga series with ${name}!` +

                //Mangadex requires that they get credit for using their API.
                //Icons also requires credit for using their emojis, so I added these notes.
                `\n\n**Credits:**` +
                `\nThis bot is owned and maintained by *[${owner.name}](https://discord.com/users/${owner.id})*. ` +
                `It also utilizes *${emoji.mangadex} [MangaDex](https://mangadex.org/about)* to fetch titles, ratings, chapters, and more about various mangas. ` +
                `The emoji icons used in this bot are created by *${emoji.icons} [Icons](https://discord.gg/aPvvhefmt3)*. `,
                color: embed.color,
                footer: {
                    text: embed.footNote,
                    icon_url: `attachment://${embed.logoName}`
                },
                timestamp: new Date().toISOString()
            }],
			ephemeral: false,
            components: [row]
		});
    }
}