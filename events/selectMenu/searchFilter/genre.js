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
	name: "genre",
	async execute(interaction, exclude) {
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

		exclude = exclude == "true" ? true : false;
		const user = await User.findOne({
			where: { userId: interaction.user.id },
		});

		let currentSearch = await user.getDataValue("currentSearch");
		let order = await user.getDataValue("order");
		let eGenre = currentSearch.eGenre || [];
		let iGenre = currentSearch.iGenre || [];
		let rejected = [];
		currentSearch.eGenre = [];
		currentSearch.iGenre = [];

		if (exclude) {
			interaction.values.forEach((value) => {
				if (!iGenre.includes(value)) {
					currentSearch.eGenre.push(value);
				} else {
					rejected.push(value);
				}
			});
			currentSearch.iGenre = iGenre;
		} else {
			interaction.values.forEach((value) => {
				if (!eGenre.includes(value)) {
					currentSearch.iGenre.push(value);
				} else {
					rejected.push(value);
				}
			});
			currentSearch.eGenre = eGenre;
		}

		await User.update(
			{ currentSearch: currentSearch },
			{ where: { userId: interaction.user.id } }
		);

		let rejectedString = ``;
		if (rejected.length > 0) {
			rejectedString = `${emoji.error} Could not ${
				!exclude ? "include" : "exclude"
			} ${rejected.length} tag(s) as they are also in ${
				exclude ? "included" : "excluded"
			} genres.`;
		}

		await interaction.editReply({
			content: `${emoji.infos} ${
				!exclude ? "Included" : "Excluded"
			} Genre(s) set!\n\n${rejectedString}`,
			embed: [
				new EmbedBuilder(interaction.embed).setFields(
					currentSearchFields(order, currentSearch)
				),
			],
		});
	},
};
