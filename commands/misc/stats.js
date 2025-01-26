const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { loading, logger } = require("../../util.js");
const { embed } = require("../../config.json");
const { Statistic, User, SearchTemplate } = require("../../db.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("stats")
		.setDescription("Shows some stats about the bot.")
		.setContexts([0, 1, 2])
		.setIntegrationTypes([0, 1]),

	async execute(interaction) {
		await interaction.reply(loading());

		let commands = "";
		let buttons = "";
		let selects = "";
		let unknowns = "";

		const stats = await Statistic.findAll().catch((error) => {
			logger.error(error);
		});

		const users = await User.findAll().catch((error) => {
			logger.error(error);
		});

		const templates = await SearchTemplate.count().catch((error) => {
			logger.error(error);
		});

		for (const statistic of stats) {
			switch (statistic.type) {
				case "command":
					commands += `${statistic.name}: ${statistic.uses}\n`;
					break;
				case "button":
					buttons += `${statistic.name}: ${statistic.uses}\n`;
					break;
				case "select":
					selects += `${statistic.name}: ${statistic.uses}\n`;
					break;
				default:
					unknowns += `${statistic.name}: ${statistic.uses}\n`;
					break;
			}
		}

		let fields = [];

		fields.push({
			name: `**Commands**`,
			value: commands || "No commands have been used yet.",
			inline: true,
		});

		fields.push({
			name: `**Buttons**`,
			value: buttons || "No buttons have been used yet.",
			inline: true,
		});

		fields.push({
			name: `**Select menus**`,
			value: selects || "No select menus have been used yet.",
			inline: true,
		});

		if (unknowns != "")
			fields.push({
				name: `**Other**`,
				value: unknowns,
				inline: false,
			});

		fields.push({
			name: `**Users**`,
			value: `There are ${users.length} registered users, of which ${
				users.filter((user) => user.banned).length
			} are banned.`,
			inline: true,
		});

		fields.push({
			name: `**Search Templates**`,
			value: `There are ${templates} user created search templates.`,
			inline: true,
		});

		fields.push({
			name: `**Uptime**`,
			value: `I have been online for ${(
				interaction.client.uptime /
				1000 /
				60
			).toFixed(2)} minutes.`,
			inline: true,
		});

		await interaction.editReply({
			content: "",
			files: [new AttachmentBuilder(embed.logo, embed.logoName)],
			embeds: [
				{
					title: `Statistics`,
					description: `Here you can see how often slash commands, buttons and select menus are used as well as the amount of users, banned users, created search templates and the uptime of the bot.`,
					color: embed.color,
					fields: fields,
					footer: {
						text: embed.footNote,
						icon_url: `attachment://${embed.logoName}`,
					},
					timestamp: new Date().toISOString(),
				},
			],
			ephemeral: false,
			components: [],
		});
	},
};
