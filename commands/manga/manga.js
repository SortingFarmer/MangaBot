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
        const resultM = await axios({
            method: 'get',
            url: `${mangadex.api}/manga/${interaction.options.getString('id')}`,
            params: {
                includes: ["cover_art", "author", "artist", "tag"]
            }
        });

        const resultR = await axios({
            method: 'GET',
            url: `${mangadex.api}/statistics/manga`,
            params: {
                manga: [interaction.options.getString('id')]
            }
        });
        const manga = resultM.data.data;

        const link = new ButtonBuilder();
        link.setLabel('Read on MangaDex');
        link.setStyle(ButtonStyle.Link);
        link.setURL(`${mangadex.url}/title/${interaction.options.getString('id')}`);

        const comments = new ButtonBuilder();
        comments.setLabel('Comments');
        comments.setStyle(ButtonStyle.Link);
        comments.setURL(`${mangadex.forum}/${resultR.data.statistics[interaction.options.getString('id')].comments.threadId}`);

        const row = new ActionRowBuilder();
        resultR.data.statistics[interaction.options.getString('id')].comments == null ? row.addComponents(link) : row.addComponents(link, comments);

        await interaction.editReply({
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
            embeds: [{
                title: manga.attributes.title.en,
                description: manga.attributes.description.en,
                color: embed.color,
                fields: [{
                    name: "Information",
                    value: `**Type:** ${manga.attributes.publicationDemographic}\n` +
                        `**Status:** ${manga.attributes.status}\n` +
                        `**Serialization:** ${manga.attributes.originalLanguage}\n` +
                        `**Authors:** ${manga.relationships.filter(r => r.type === "author").map(r => r.attributes?.name).join(", ")}\n` +
                        `**Artists:** ${manga.relationships.filter(r => r.type === "artist").map(r => r.attributes?.name).join(", ")}\n` +
                        `**Tags:** ${manga.attributes.tags.map(r => r.attributes.name.en).join(", ")}\n` +
                        `**Comments:** ${resultR.data.statistics[interaction.options.getString('id')].comments.repliesCount}\n` +
                        `**Follows:** ${resultR.data.statistics[interaction.options.getString('id')].follows}\n` +
                        `**Rating:** ${resultR.data.statistics[interaction.options.getString('id')].rating.bayesian}\n`
                }],
                footer: {
                    text: embed.footNote,
                    icon_url: `attachment://${embed.logoName}`
                },
                timestamp: new Date().toISOString(),
                thumbnail: {
                    url: `${mangadex.img}/${interaction.options.getString('id')}/${manga.relationships.filter(r => r.type === "cover_art")[0].attributes?.fileName}`
                }
            }],
            ephemeral: false,
            components: [row]
        });
    }
}