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
const {} = require("../../../searchComponents.js");

module.exports = {
	name: "",
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
			where: interaction.user.id,
		});

		let currentSearch = await user.getDataValue("currentSearch");
		let order = await user.getDataValue("order");
		currentSearch.e = interaction.values;

		await User.update(
			{ currentSearch: currentSearch },
			{ where: { userId: interaction.user.id } }
		);

		await interaction.editReply({
			content: `${emoji.infos} e set!`,
			embed: [
				new EmbedBuilder(interaction.embed).setFields(
					currentSearchFields(order, currentSearch)
				),
			],
		});
	},
};
