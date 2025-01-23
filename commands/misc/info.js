const { SlashCommandBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { embed, name, invite, supportServer, github, owner, legal, expire } = require("../../config.json");
const emoji = require("../../emojis.json");
const { version, license } = require("../../package.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides information about the bot.')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1]),

    async execute(interaction) {
        const donate = new ButtonBuilder();
        donate.setCustomId(`support_${interaction.user.id}_${Math.floor(Date.now()/1000) + expire}`);
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

        try {
            await interaction.reply({
                files: [new AttachmentBuilder(embed.logo, embed.logoName)],
                embeds: [{
                    title: "Informations Menu",
                    description: `Introducing ${name}, a versatile bot designed to enhance your manga reading experience. With ${name}, you can effortlessly search for your favorite manga titles and discover new ones using a variety of filters. Create personalized lists of the manga you love and follow them to receive notifications whenever a new chapter is released.` +
                    `\n\n${name} can be seamlessly integrated into your server, where it will post updates in a designated channel whenever new manga chapters are available. Additionally, you have the option to add ${name} to your user apps, allowing you to access its features and look up manga from anywhere, at any time.` + 
                    `\n\nExperience the convenience and excitement of staying up-to-date with your favorite manga series with ${name}!`,
                    fields: [{
                        name: "**Credits:**",
                        value: `This bot is owned and maintained by *[${owner.name}](https://discord.com/users/${owner.id})*. ` +
                        `It also utilizes *${emoji.mangadex} [MangaDex](https://mangadex.org/about)* to fetch titles, ratings, chapters, and more about various mangas. ` +
                            `The emoji icons used in this bot are created by *${emoji.icons} [Icons](https://discord.gg/aPvvhefmt3)*. `
                    }, {
                        name: "**ToS and Privacy Policy:**",
                        value: `By using ${name}, you agree to our [Terms of Service](${legal.terms}) and [Privacy Policy](${legal.privacy}).`
                    }, {
                        name: "**Version:**",
                        value: `The current version of ${name} is *${version}*\n` +
                            `You can view the latest release and its notes on the [GitHub](${github}/commit/main).`
                    }, {
                        name: "**Other notes:**",
                        value: `This bot is licensed under the *${license}* license.\n` +
                            `We will not display any pornographic content.\n` +
                            `If you encounter any issues or have any suggestions, please feel free to contact us on our [Support Server](${supportServer}) or submit a bug report on our [GitHub](${github}).`
                    }],
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
        } catch (e) {
            console.error(e);
        }
    }
}