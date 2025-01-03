const { AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { embed, mangadex, supportServer } = require("../../config.json");
const emoji = require("../../emojis.json");
const { fetchMangaData } = require("../../util");

module.exports = {
    name: "search",
    async execute(interaction) {
        await interaction.update({
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
            embeds: [{
                title: "Browse Manga",
                description: `${emoji.loading} Fetching manga...`,
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
            ({tempM, tempR} = await fetchMangaData(mangadex.api, 0, 20));
            if (tempM.data.result == "error") {
                console.error(`An error occured :c\nTitle: ${tempM.data.errors.title}\nDescription: ${tempM.data.errors.detail}`);
            }
        } while (!tempM.data.result == 'ok');

        const row1 = new ActionRowBuilder();
        const row2 = new ActionRowBuilder();
        const row3 = new ActionRowBuilder();
        const row4 = new ActionRowBuilder();
        const pages = new ActionRowBuilder();
        
        const mangas = tempM.data.data;
        let mangaField = [];
        for (let i = 0; i < mangas.length; i++) {
            const manga = mangas[i];
            let title = manga.attributes.title.en;
            let description = manga.attributes.description.en;
            let id = manga.id;
            let result = `*Description:*\n${description}`;
            
            if (result.length > 200) {
                const maxDescriptionLength = 200 - (result.length - description.length);
                description = description.substring(0, maxDescriptionLength - 3) + '...';
                result = `*Description:*\n${description}`;
            }

            if (title.length > 25) {
                title = title.substring(0, 25 - 3) + '...';
            }
            
            mangaField.push({
                name: '**'+title+'**',
                value: result,
                inline: true
            });

            if (i < 5) {
                row1.addComponents(new ButtonBuilder()
                    .setLabel(title)
                    .setCustomId(`manga_${interaction.user.id}_${i}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(emoji.infos)
                );
            } else if (i < 10) {
                row2.addComponents(new ButtonBuilder()
                    .setLabel(title)
                    .setCustomId(`manga_${interaction.user.id}_${i}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(emoji.infos)
                );
            } else if (i < 15) {
                row3.addComponents(new ButtonBuilder()
                    .setLabel(title)
                    .setCustomId(`manga_${interaction.user.id}_${i}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(emoji.infos)
                );
            } else if (i < 20) {
                row4.addComponents(new ButtonBuilder()
                    .setLabel(title)
                    .setCustomId(`manga_${interaction.user.id}_${i}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(emoji.infos)
                );
            }
        }

        pages.addComponents(new ButtonBuilder()
            .setLabel("Previous")
            .setCustomId(`previous_${interaction.user.id}_20`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(emoji.left)
            .setDisabled(true),
            new ButtonBuilder()
            .setLabel("1")
            .setCustomId(`page_${interaction.user.id}_21`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
            new ButtonBuilder()
            .setLabel("2")
            .setCustomId(`page_${interaction.user.id}_22`)
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setLabel("3")
            .setCustomId(`page_${interaction.user.id}_23`)
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setLabel("Next")
            .setCustomId(`next_${interaction.user.id}_24`)
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
            components: [row1, row2, row3, row4, pages]
        });
    }
}