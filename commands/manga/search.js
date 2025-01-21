const { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const emoji = require('../../emojis.json');
const { fetchMangaData, loading } = require('../../util');
const { mangadex, embed } = require('../../config.json');
const { User } = require('../../db.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for a specific manga.')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .addStringOption(option => option.setName('name')
            .setDescription('The name that you want to search for.')
            .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply(loading());

        await User.update({ 
            currentSearch: { 
                title: interaction.options.getString('name'), 
                contentRating: ['safe', 'suggestive', 'erotica'] 
            }, 
            order: { 
                "relevance": "desc" 
            }, 
            page: 0
        }, { 
            where: { 
                userId: interaction.user.id 
            }
        });

        let tempM = await fetchMangaData(mangadex.api, 0, 25, { 
            title: interaction.options.getString('name'), 
            contentRating: ['safe', 'suggestive', 'erotica'] 
        }, { 
            "relevance": "desc" 
        });

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
            .setCustomId(`manga_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`)
            .setPlaceholder("Select a manga")
            .addOptions(mangaListStrings)
        );

        pages.addComponents(
            new ButtonBuilder()
            .setCustomId(`1`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
            .setEmoji(emoji.spacer),
            new ButtonBuilder()
            .setLabel("Back")
            .setCustomId(`backPage_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`)
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
            .setEmoji(emoji.left),
            new ButtonBuilder()
            .setLabel(`1`)
            .setCustomId(`2`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
            new ButtonBuilder()
            .setLabel("Next")
            .setCustomId(`nextPage_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(emoji.right)
            .setDisabled(mangaField.length < 25),
            new ButtonBuilder()
            .setCustomId(`3`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emoji.spacer)
            .setDisabled(true)
        );

        await interaction.editReply({
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
            embeds: [{
                title: "Browse Manga",
                description: `Here are ${mangaField.length} manga you can read:\n` +
                `Below you can use the select menu for more information on the manga or to follow it.`,
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