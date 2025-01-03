const { AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { embed, mangadex } = require("../../config.json");
const emoji = require("../../emojis.json");
const { fetchMangaData } = require("../../util");

module.exports = {
    name: "search",
    async execute(interaction) {
        await interaction.update({
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
            embeds: [{
                title: "Browse Manga",
                description: `${emoji.loading} Fetching mangas...`,
                color: embed.color,
                footer: {
                    text: embed.footNote,
                    icon_url: `attachment://${embed.logoName}`
                },
                timestamp: new Date().toISOString()
            }],
            ephemeral: false,
            components: []
        })
        
        let tempM, tempR;
        do {
            ({tempM, tempR} = await fetchMangaData(mangadex.api, 0, 25));
            if (tempM.data.result == "error") {
                console.error(`An error occured :c\nTitle: ${tempM.data.errors.title}\nDescription: ${tempM.data.errors.detail}`);
            }
        } while (tempM.data.result != 'ok');

        const mangaList = new ActionRowBuilder();
        const pages = new ActionRowBuilder();
        let mangaListStrings = [];
        const mangas = tempM.data.data;
        let mangaField = [];
        for (let i = 0; i < mangas.length; i++) {
            const manga = mangas[i];
            let title = manga.attributes.title?.en || manga.attributes.title[Object.keys(manga.attributes.title)[0]];
            let description = manga.attributes.description.en;
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
                shortTitle = title.substring(0, 25 - 3) + '...';
            } else if (title.length > 100) {
                longTitle = title.substring(0, 100 - 3) + '...';
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
            /*new ButtonBuilder()
            .setLabel("Previous")
            .setCustomId(`previous_${interaction.user.id}`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(emoji.left)
            .setDisabled(true),*/
            new ButtonBuilder()
            .setLabel("1")
            .setCustomId(`page_${interaction.user.id}_1`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
            new ButtonBuilder()
            .setLabel("2")
            .setCustomId(`page_${interaction.user.id}_2`)
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setLabel("3")
            .setCustomId(`page_${interaction.user.id}_3`)
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setLabel("Previous")
            .setCustomId(`previous_${interaction.user.id}`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(emoji.left)
            .setDisabled(true),
            new ButtonBuilder()
            .setLabel("Next")
            .setCustomId(`next_${interaction.user.id}`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(emoji.right)/*
            new ButtonBuilder()
            .setLabel("4")
            .setCustomId(`page_${interaction.user.id}_4`)
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setLabel("5")
            .setCustomId(`page_${interaction.user.id}_5`)
            .setStyle(ButtonStyle.Secondary),*/
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