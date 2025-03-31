const { loading, logger, currentSearchFields } = require("../../../util.js");
const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	AttachmentBuilder,
} = require("discord.js");
const emoji = require("../../../emojis.json");
const { embed, expire } = require("../../../config.json");
const stringSelect = require("../../../searchComponents.js");
const { User } = require("../../../db.js");

module.exports = {
	name: "filter",
	async execute(interaction, page) {
		await interaction.update(loading());

		let user = await User.findOne({
			where: { userId: interaction.user.id },
		});
		let currentSearch = await user.getDataValue("currentSearch");
		let order = await user.getDataValue("order");

		const row1 = new ActionRowBuilder();
		const row2 = new ActionRowBuilder();
		const row3 = new ActionRowBuilder();
		const row4 = new ActionRowBuilder();
		const row5 = new ActionRowBuilder();
		let description = "";

		if (page == 1) {
			// sorting, content rating, demographic, status
			description = `Choose here how you want the results to be sorted and if they should be included or excluded based on the content rating, demographic, and status.`;

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
		} else if (page == 2) {
			// include: format, genre, theme, theme2
			description = `Choose here which formats, genres, themes you want to include in the results.\n*(note: themes is split between two because there are too many)*`;

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
		} else if (page == 3) {
			// exclude: format, genre, theme, theme2
			description = `Choose here which formats, genres, themes you want to exclude from the results.\n*(note: themes are split between two because there are too many)*`;

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
		} else if (page == 4) {
			// set year, tags inclusion and exclusion mode, search, author, artist
			description = `Here you can add other stuff such as release years, searches, tags inclusion and exlusion mode as well as add or remove authors and artists.\n*(note: in tags inclusion/exclusion mode "and" means that all selected tags are required and "or" means that at least one needs to fit)*\n\nComming soon!`;

			row1.addComponents(
				stringSelect.year(interaction.user.id),
				stringSelect.year(interaction.user.id, true),
				stringSelect.searchTitle(interaction.user.id),
				stringSelect.searchTitle(interaction.user.id, true)
			);
			row2.addComponents(
				stringSelect.tagMode(interaction.user.id, true, true, true),
				stringSelect.tagMode(interaction.user.id, true, true),
				stringSelect.tagMode(interaction.user.id, false, true)
			);
			row3.addComponents(
				stringSelect.tagMode(interaction.user.id, true, false, true),
				stringSelect.tagMode(interaction.user.id, true, false),
				stringSelect.tagMode(interaction.user.id, false, false)
			);
			row4.addComponents(
				stringSelect.creator(interaction.user.id),
				stringSelect.creator(interaction.user.id, true, true),
				stringSelect.creator(interaction.user.id, false),
				stringSelect.creator(interaction.user.id, false, true)
			);
		}

		const cancel = new ButtonBuilder()
			.setLabel("Cancel")
			.setCustomId(
				`cancelFilter_${interaction.user.id}_${
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
			.setStyle(ButtonStyle.Danger)
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

		const search = new ButtonBuilder()
			.setLabel("Start browsing")
			.setCustomId(
				`search_${interaction.user.id}_${
					Math.floor(Date.now() / 1000) + expire
				}`
			)
			.setStyle(ButtonStyle.Primary)
			.setEmoji(emoji.question);

		row5.addComponents(
			page == 1
				? [cancel, next]
				: page == 4
				? [back, search]
				: [back, next]
		);

		const components = [];

		if (row1.components.length >= 1) {
			components.push(row1);
		}
		if (row2.components.length >= 1) {
			components.push(row2);
		}
		if (row3.components.length >= 1) {
			components.push(row3);
		}
		if (row4.components.length >= 1) {
			components.push(row4);
		}
		if (row5.components.length >= 1) {
			components.push(row5);
		}

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
							`You can also use the **Cancel** button to cancel the filter and instead use the default one or use the **Back** button to go to the previous page.`,
						color: embed.color,
						fields: currentSearchFields(order, currentSearch),
						footer: {
							text: embed.footNote,
							icon_url: `attachment://${embed.logoName}`,
						},
						timestamp: new Date().toISOString(),
					},
				],
				ephemeral: false,
				components: components,
			});
		} catch (error) {
			logger.error(error);
		}
	},
};
