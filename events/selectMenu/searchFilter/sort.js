const { loading, logger, currentSearchFields } = require("../../../util.js");
const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
	AttachmentBuilder,
	EmbedBuilder,
} = require("discord.js");
const emoji = require("../../../emojis.json");
const { embed, expire } = require("../../../config.json");
const { User } = require("../../../db.js");
const stringSelect = require("../../../searchComponents.js");

module.exports = {
	name: "sort",
	async execute(interaction) {
		await interaction.update(
			loading(
				false,
				"Loading",
				"Setting content rating...",
				false,
				false,
				interaction
			)
		);

		let user = await User.findOne({
			where: { userId: interaction.user.id },
		});

		let currentSearch = await user.getDataValue("currentSearch");

		await User.update(
			{ order: JSON.parse(interaction.values[0]) },
			{ where: { userId: interaction.user.id } }
		);

		await interaction.editReply({
			content: `${emoji.infos} Sorting method set!`,
			embed: [
				new EmbedBuilder(interaction.embed).setFields(
					currentSearchFields(
						JSON.parse(interaction.values[0]),
						currentSearch
					)
				),
			],
		});
	},
};
