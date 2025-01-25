const { AttachmentBuilder } = require("discord.js");
const {
	embed,
	supportServer,
	owner,
	supportLinks,
} = require("../../../config.json");
const emoji = require("../../../emojis.json");

module.exports = {
	name: "support",
	async execute(interaction) {
		await interaction.update({
			files: [new AttachmentBuilder(embed.logo, embed.logoName)],
			embeds: [
				{
					title: "Support options",
					description:
						`Do you want to do something to support us more, than being just a user?\n\n` +
						`__**Then support us by donating or boosting the support server.**__\n` +
						`We don't offer any rewards, however you can help us through one of these ways:\n` +
						`${emoji.link} Share this bot with others. ${emoji.link}\n` +
						`${emoji.boost} Boosting the [support server](${supportServer}). ${emoji.boost}\n` +
						`${emoji.paypal} Donate directly, PayPal [${owner.name}](https://discord.com/users/${owner.id}) money. ${emoji.paypal}\n` +
						`${emoji.topgg} Upvote on [top.gg](${supportLinks.topgg}) ${emoji.topgg}\n` +
						`\n${emoji.shine} More ways to support us coming soon. ${emoji.shine}`,
					color: embed.color,
					footer: {
						text: embed.footNote,
						icon_url: `attachment://${embed.logoName}`,
					},
					timestamp: new Date().toISOString(),
				},
			],
			ephemeral: true,
			components: [],
		});
	},
};
