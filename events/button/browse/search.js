const { AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { embed, mangadex } = require("../../../config.json");
const emoji = require("../../../emojis.json");
const { fetchMangaData, logger, loading } = require("../../../util.js");
const { User } = require('../../../db.js');

module.exports = {
    name: "search",
    async execute(interaction) {
        await interaction.update(loading());

        let user = await User.findOne({ where: { userId: interaction.user.id } }).catch((error) => {
            logger.error(error);
        });

        if (!user) {
            return logger.warn("User not found!");
        }

        let userJson = user.toJSON();
        
        let tempM = await fetchMangaData(mangadex.api, Number(userJson.page), Number(userJson.limit), userJson.currentSearch, userJson.order);

        const mangaList = new ActionRowBuilder();
        const pages = new ActionRowBuilder();
        let mangaListStrings = [];
        const mangas = tempM.data.data;
        let mangaField = [];
        for (let manga of mangas) {
            let title = manga.attributes.title?.en || manga.attributes.title[Object.keys(manga.attributes.title)[0]];
            let description = manga.attributes.description.en || "No description available.";
            let id = manga.id;
            let result = `*Description:*\n${description}`;
            
            if (result.length > 200) {
                const maxDescriptionLength = 200 - (result.length - description.length);
                description = description.substring(0, maxDescriptionLength - 3) + '...';
                result = `*Description:*\n${description}`;
            }

            let shortTitle = title;
            let longTitle = title;
            if (title.length > 25) {
                shortTitle = title.substring(0, (25 - 3)) + '...';
            }
            if (title.length > 100) {
                longTitle = title.substring(0, (100 - 3)) + '...';
            }
            
            mangaField.push({
                name: '**'+shortTitle+'**',
                value: result,
                inline: true
            });

            mangaListStrings.push({ label: longTitle, value: id });
        }

        mangaList.addComponents(new StringSelectMenuBuilder()
            .setCustomId(`manga_${interaction.user.id}`)
            .setPlaceholder("Select a manga")
            .addOptions(mangaListStrings)
        );

        pages.addComponents(
            new ButtonBuilder()
            .setLabel("1")
            .setCustomId(`page_${interaction.user.id}_1`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
            new ButtonBuilder()
            .setLabel("2")
            .setCustomId(`page_${interaction.user.id}_2`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false),
            new ButtonBuilder()
            .setLabel("3")
            .setCustomId(`page_${interaction.user.id}_3`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false),
            new ButtonBuilder()
            .setLabel("Previous")
            .setCustomId(`previousPage_${interaction.user.id}`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(emoji.left)
            .setDisabled(true),
            new ButtonBuilder()
            .setLabel("Next")
            .setCustomId(`nextPage_${interaction.user.id}`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(emoji.right)
        );

        await interaction.editReply({
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
            embeds: [{
                title: "Browse Manga",
                description: `Here are some manga you can read:\n` +
                `Below you can press on the button for more information on the manga or to follow it.`,
                color: embed.color,
                fields: mangaField,
                footer: {
                    text: embed.footNote,
                    icon_url: `attachment://${embed.logoName}`
                },
                timestamp: new Date().toISOString()
            }],
            ephemeral: false,
            components: [mangaList, pages]
        });
    }
}