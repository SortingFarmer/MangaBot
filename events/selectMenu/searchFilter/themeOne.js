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
	name: "themeOne",
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
		let eThemeOne = currentSearch.eThemeOne || [];
		let iThemeOne = currentSearch.iThemeOne || [];
		let rejected = [];
		currentSearch.eThemeOne = [];
		currentSearch.iThemeOne = [];

		if (exclude) {
			interaction.values.forEach((value) => {
				if (!iThemeOne.includes(value)) {
					currentSearch.eThemeOne.push(value);
				} else {
					rejected.push(value);
				}
			});
			currentSearch.iThemeOne = iThemeOne;
		} else {
			interaction.values.forEach((value) => {
				if (!eThemeOne.includes(value)) {
					currentSearch.iThemeOne.push(value);
				} else {
					rejected.push(value);
				}
			});
			currentSearch.eThemeOne = eThemeOne;
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
			} themes¹.`;
		}

		await interaction.editReply({
			content: `${emoji.infos} ${
				!exclude ? "Included" : "Excluded"
			} Theme(s)¹ set!\n\n${rejectedString}`,
			embed: [
				new EmbedBuilder(interaction.embed).setFields(
					currentSearchFields(order, currentSearch)
				),
			],
		});
	},
};
