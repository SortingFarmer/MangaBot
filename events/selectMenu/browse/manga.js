const { AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const axios = require('axios');
const { embed, mangadex } = require("../../../config.json");
const emoji = require("../../../emojis.json");
const { mangaEmbed, loading, fetchChapterData } = require("../../../util");


module.exports = {
    name: "manga",
    async execute(interaction) {
        await interaction.update(loading());

        let mangaId = interaction.values[0];
        let resultM;
        let resultR;
        let resultC;
        
        try {
            resultM = await axios({
                method: 'get',
                url: `${mangadex.api}/manga/${mangaId}`,
                params: {
                    includes: ["cover_art", "author", "artist", "tag"]
                }
            });
    
            resultR = await axios({
                method: 'GET',
                url: `${mangadex.api}/statistics/manga`,
                params: {
                    manga: [mangaId]
                }
            });

            resultC = await fetchChapterData(mangadex.api, mangaId);
        } catch (error) {
            await interaction.editReply({ content: `${emoji.error} You entered an invalid id.`, ephemeral: true, embeds: [], });
        }
        
        const manga = resultM.data.data;

        if (manga.attributes.contentRating == "pornographic") {
            await interaction.editReply({
                content: `${emoji.error} The manga you are trying to display contains pornographic content.`,
                ephemeral: true,
                embeds: [],
            });
            
        } else {
            const back = new ButtonBuilder();
            back.setLabel('Back to browsing');
            back.setCustomId(`search_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`);
            back.setStyle(ButtonStyle.Success);
            back.setEmoji(emoji.left);

            const follow = new ButtonBuilder();
            follow.setLabel('Follow manga');
            follow.setCustomId(`follow_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`)
            follow.setStyle(ButtonStyle.Primary);
            follow.setDisabled(true);

            const link = new ButtonBuilder();
            link.setLabel('Read on MangaDex');
            link.setStyle(ButtonStyle.Link);
            link.setURL(`${mangadex.url}/title/${mangaId}`);

            const comments = new ButtonBuilder();
            comments.setLabel('Comments');
            comments.setStyle(ButtonStyle.Link);
            comments.setURL(`${mangadex.forum}/${resultR.data.statistics[mangaId].comments.threadId}`);

            const row = new ActionRowBuilder();
            resultR.data.statistics[mangaId].comments == null ? row.addComponents(back, follow, link) : row.addComponents(back, follow, link, comments);

            await interaction.editReply({
                files: [new AttachmentBuilder(embed.logo, embed.logoName)],
                embeds: [mangaEmbed(resultM.data.data, resultR, resultC.data.data)],
                ephemeral: false,
                components: [row]
            });
        }
    }
}