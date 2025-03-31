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
	name: "themeTwo",
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
		let eThemeTwo = currentSearch.eThemeTwo || [];
		let iThemeTwo = currentSearch.iThemeTwo || [];
		let rejected = [];
		currentSearch.eThemeTwo = [];
		currentSearch.iThemeTwo = [];

		if (exclude) {
			interaction.values.forEach((value) => {
				if (!iThemeTwo.includes(value)) {
					currentSearch.eThemeTwo.push(value);
				} else {
					rejected.push(value);
				}
			});
			currentSearch.iThemeTwo = iThemeTwo;
		} else {
			interaction.values.forEach((value) => {
				if (!eThemeTwo.includes(value)) {
					currentSearch.iThemeTwo.push(value);
				} else {
					rejected.push(value);
				}
			});
			currentSearch.eThemeTwo = eThemeTwo;
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
			} themes².`;
		}

		await interaction.editReply({
			content: `${emoji.infos} ${
				!exclude ? "Included" : "Excluded"
			} Theme(s)² set!\n\n${rejectedString}`,
			embed: [
				new EmbedBuilder(interaction.embed).setFields(
					currentSearchFields(order, currentSearch)
				),
			],
		});
	},
};
