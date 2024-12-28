const { SlashCommandBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const axios = require('axios');
const { embed, mangadex } = require("../../config.json");
const emoji = require("../../emojis.json");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("manga")
        .setDescription("Display a manga.")
        .addStringOption(option =>
            option.setName('id')
            .setDescription('The ID of the manga you want to display.')
            .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        let resultM;
        let resultR;
        
        try {
            resultM = await axios({
                method: 'get',
                url: `${mangadex.api}/manga/${interaction.options.getString('id')}`,
                params: {
                    includes: ["cover_art", "author", "artist", "tag"]
                }
            });
    
            resultR = await axios({
                method: 'GET',
                url: `${mangadex.api}/statistics/manga`,
                params: {
                    manga: [interaction.options.getString('id')]
                }
            });
        } catch (error) {
            await interaction.editReply({ content: `${emoji.error} You entered an invalid id.`, ephemeral: true });
        }
        const manga = resultM.data.data;

        if (manga.attributes.contentRating == "pornographic") {
            await interaction.editReply({ content: `${emoji.error} The manga you are trying to display contains pornographic content.`, ephemeral: true });
            
        } else {
            const follow = new ButtonBuilder();
            follow.setLabel('Follow manga');
            follow.setCustomId({
                type: "follow",
                manga: interaction.options.getString('id'),
                user: interaction.user
            }.toString())
            follow.setStyle(ButtonStyle.Primary);
            follow.setDisabled(true);

            const link = new ButtonBuilder();
            link.setLabel('Read on MangaDex');
            link.setStyle(ButtonStyle.Link);
            link.setURL(`${mangadex.url}/title/${interaction.options.getString('id')}`);

            const comments = new ButtonBuilder();
            comments.setLabel('Comments');
            comments.setStyle(ButtonStyle.Link);
            comments.setURL(`${mangadex.forum}/${resultR.data.statistics[interaction.options.getString('id')].comments.threadId}`);

            const row = new ActionRowBuilder();
            resultR.data.statistics[interaction.options.getString('id')].comments == null ? row.addComponents(follow, link) : row.addComponents(follow, link, comments);

            let altTitle = "";
            manga.attributes.altTitles.forEach(altTitles => Object.entries(altTitles).forEach(([key, value]) => altTitle += `**${key}:** ${value}\n` ));
            let lastVolume = "";
            let lastChapter = "";
            if (manga.attributes.status == "completed" || manga.attributes.status == "cancelled") {
                if (!manga.attributes.lastVolume == "") {
                    lastVolume = `**Last Volume:** ${manga.attributes.lastVolume}\n`;
                }
                if (!manga.attributes.lastChapter == "") {
                    lastChapter = `**Last Chapter:** ${manga.attributes.lastChapter}\n`
                }
            }

            await interaction.editReply({
                files: [new AttachmentBuilder(embed.logo, embed.logoName)],
                embeds: [{
                    title: manga.attributes.title.en,
                    description: "",
                    color: embed.color,
                    fields: [{
                        name: "**Description**",
                        value: manga.attributes.description.en || "No description available."
                    },{
                        name: "**Alternative Titles**",
                        value: altTitle || "No alternative titles available."
                    },{
                        name: "**Information**",
                        value: `` +
                            `**Demographic:** ${manga.attributes.publicationDemographic || "Type not available."}\n` +
                            `**Content Rating:** ${manga.attributes.contentRating}\n` +
                            `**Original language:** ${manga.attributes.originalLanguage}\n` +
                            `**Authors:** ${manga.relationships.filter(r => r.type === "author").map(r => r.attributes?.name).join(", ")}\n` +
                            `**Artists:** ${manga.relationships.filter(r => r.type === "artist").map(r => r.attributes?.name).join(", ")}\n` +
                            `**Status:** ${manga.attributes.status}\n` +
                            `${lastVolume}` +
                            `${lastChapter}` +
                            `**Year:** ${manga.attributes.year}` +
                            `**Tags:** ${manga.attributes.tags.map(r => r.attributes.name.en).join(", ")}\n` +
                            `**Comments:** ${resultR.data.statistics[interaction.options.getString('id')].comments.repliesCount || 0}\n` +
                            `**Follows:** ${resultR.data.statistics[interaction.options.getString('id')].follows}\n` +
                            `**Rating:** ${resultR.data.statistics[interaction.options.getString('id')].rating.bayesian.toFixed(2)}\n` +
                            `**Translated languages:** ${manga.attributes.availableTranslatedLanguages.join(", ")}`
                    }],
                    footer: {
                        text: embed.footNote,
                        icon_url: `attachment://${embed.logoName}`
                    },
                    timestamp: new Date().toISOString(),
                    thumbnail: {
                        url: `${mangadex.img}/${interaction.options.getString('id')}/${manga.relationships.filter(r => r.type === "cover_art")[0].attributes.fileName}`
                    }
                }],
                ephemeral: false,
                components: [row]
            });
        }
    }
}