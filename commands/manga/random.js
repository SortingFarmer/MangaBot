const { SlashCommandBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { loading, fetchStatisticsData, mangaEmbed, logger, fetchChapterData } = require('../../util');
const { default: axios } = require('axios');
const { mangadex, embed, expire } = require('../../config.json');
const emoji = require('../../emojis.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('View a random manga.')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1]),

    async execute(interaction) {
        await interaction.deferReply(loading());

        let result;
        let stats;
        let chapters;
        
        try {
            result = await axios({
                method: 'GET',
                url: mangadex.api + '/manga/random',
                params: {
                    includes: ['cover_art', 'author', 'artist', 'tag'],
                    contentRating: ['safe', 'suggestive', 'erotica']
                }
            });
    
            stats = await fetchStatisticsData(mangadex.api, [result.data.data.id]);
            chapters = await fetchChapterData(mangadex.api, result.data.data.id)
        } catch (error) {
            logger.error(error);
        }

        const random = new ButtonBuilder();
        random.setLabel('Show another')
        random.setCustomId(`random_${interaction.user.id}_${Math.floor(Date.now()/1000) + expire}`)
        random.setEmoji(emoji.right)
        random.setStyle(ButtonStyle.Success);

        const follow = new ButtonBuilder();
        follow.setLabel('Follow manga');
        follow.setCustomId(`follow_${interaction.user.id}_${Math.floor(Date.now()/1000) + expire}`)
        follow.setStyle(ButtonStyle.Primary);
        follow.setDisabled(true);

        const link = new ButtonBuilder();
        link.setLabel('Read on MangaDex');
        link.setStyle(ButtonStyle.Link);
        link.setURL(`${mangadex.url}/title/${result.data.data.id}`);

        const comments = new ButtonBuilder();
        comments.setLabel('Comments');
        comments.setStyle(ButtonStyle.Link);
        comments.setURL(`${mangadex.forum}/${stats.data.statistics[result.data.data.id].comments?.threadId}`);

        const row = new ActionRowBuilder();
        stats.data.statistics[result.data.data.id].comments == null ? row.addComponents(random, follow, link) : row.addComponents(random, follow, link, comments);

        await interaction.editReply({
            content: "",
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
            embeds: [mangaEmbed(result.data.data, stats, chapters.data.data)],
            ephemeral: false,
            components: [row]
        });
    }
}