const { loading, logger } = require("../../../util.js");
const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	AttachmentBuilder,
} = require("discord.js");
const emoji = require("../../../emojis.json");
const { embed, expire } = require("../../../config.json");
const stringSelect = require("../../../searchComponents.js");

module.exports = {
	name: "filter",
	async execute(interaction, page) {
		await interaction.update(loading());

		const row1 = new ActionRowBuilder();
		const row2 = new ActionRowBuilder();
		const row3 = new ActionRowBuilder();
		const row4 = new ActionRowBuilder();
		const row5 = new ActionRowBuilder();
		let description = "";
		logger.info("Filter page " + page);

		if (page == 1) {
			// sorting, content rating, demographic, status
			description = `Choose here how you want the results to be sorted and if they should be included or excluded based on the content rating, demographic, and status.`;

			try {
				row1.addComponents(
					stringSelect.sortStringSelect(interaction.user.id)
				);
				row2.addComponents(
					stringSelect.contentRatingStringSelect(interaction.user.id)
				);
				row3.addComponents(
					stringSelect.demographicStringSelect(interaction.user.id)
				);
				row4.addComponents(
					stringSelect.statusStringSelect(interaction.user.id)
				);
			} catch (error) {
				logger.error(error);
			}
		} else if (page == 2) {
			// include: format, genre, theme, theme2
			description = `Choose here which formats, genres, themes you want to include in the results. (note: themes is split between two because there are too many)`;

			try {
				row1.addComponents(
					stringSelect.formatStringSelect(interaction.user.id)
				);
				row2.addComponents(
					stringSelect.genreStringSelect(interaction.user.id)
				);
				row3.addComponents(
					stringSelect.themeOneStringSelect(interaction.user.id)
				);
				row4.addComponents(
					stringSelect.themeTwoStringSelect(interaction.user.id)
				);
			} catch (error) {
				logger.error(error);
			}
		} else if (page == 3) {
			// exclude: format, genre, theme, theme2
			description = `Choose here which formats, genres, themes you want to exclude from the results. (note: themes is split between two because there are too many)`;

			try {
				row1.addComponents(
					stringSelect.formatStringSelect(interaction.user.id, true)
				);
				row2.addComponents(
					stringSelect.genreStringSelect(interaction.user.id, true)
				);
				row3.addComponents(
					stringSelect.themeOneStringSelect(interaction.user.id, true)
				);
				row4.addComponents(
					stringSelect.themeTwoStringSelect(interaction.user.id, true)
				);
			} catch (error) {
				logger.error(error);
			}
		} else {
			logger.error("Invalid page number");
			description = `Invalid page number. Please try again.`;

			const blank = new ButtonBuilder()
				.setDisabled(true)
				.setLabel(`INVALID PAGE ${page}`)
				.setEmoji(emoji.error)
				.setStyle(ButtonStyle.Secondary);

			blank.setCustomId(`ajrtxcvb${Math.random()}`);
			row1.addComponents(blank);
			blank.setCustomId(`ahefgxx${Math.random()}`);
			row2.addComponents(blank);
			blank.setCustomId(`sdfawer${Math.random()}`);
			row3.addComponents(blank);
			blank.setCustomId(`asdgsdfgg${Math.random()}`);
			row4.addComponents(blank);
		}

		const cancel = new ButtonBuilder()
			.setLabel("Cancel")
			.setCustomId(
				`cancel_${interaction.user.id}_${
					Math.floor(Date.now() / 1000) + expire
				}`
			)
			.setStyle(ButtonStyle.Danger)
			.setEmoji(emoji.xx);
		const back = new ButtonBuilder()
			.setLabel("Back")
			.setCustomId(
				`filter.${Number(page) - 1}_${interaction.user.id}_${
					Math.floor(Date.now() / 1000) + expire
				}`
			)
			.setStyle(ButtonStyle.Secondary)
			.setEmoji(emoji.left);
		const next = new ButtonBuilder()
			.setLabel("Next")
			.setCustomId(
				`filter.${Number(page) + 1}_${interaction.user.id}_${
					Math.floor(Date.now() / 1000) + expire
				}`
			)
			.setStyle(ButtonStyle.Success)
			.setEmoji(emoji.right);

		row5.addComponents(page == 1 ? [cancel, next] : [cancel, back, next]);

		try {
			await interaction.editReply({
				content: "",
				files: [new AttachmentBuilder(embed.logo, embed.logoName)],
				embeds: [
					{
						title: `Custom Filter - Page ${page}`,
						description:
							description +
							`\n\n` +
							`Customize the filters how you want and then click the **Next** button.\n` +
							`You can also use the **Cancel** button to cancel the filter and instead use the default one.`,
						color: embed.color,
						fields: [],
						footer: {
							text: embed.footNote,
							icon_url: `attachment://${embed.logoName}`,
						},
						timestamp: new Date().toISOString(),
					},
				],
				ephemeral: false,
				components: [row1, row2, row3, row4, row5],
			});
		} catch (error) {
			logger.error(error);
		}
	},
};
