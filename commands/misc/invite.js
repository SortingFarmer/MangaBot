const { SlashCommandBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { embed, name, invite, supportServer, github, owner } = require('../../config.json');
const emoji = require('../../emojis.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Shows the invite link for the bot.'),

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
                title: "Invite",
                description: `Invite ${name} to your server and enjoy the convenience of looking up manga titles, creating lists, and receiving notifications for new chapters. ` +
                `\nTo add ${name} to your server, click the "Invite bot" button below. ` +	
                `\n\n**Credits:**` +
                `\nThis bot is owned and maintained by *[${owner.name}](https://discord.com/users/${owner.id})*. `,
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