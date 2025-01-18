const { SlashCommandBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const axios = require('axios');
const { embed, mangadex } = require("../../config.json");
const emoji = require("../../emojis.json");
const { mangaEmbed } = require("../../util");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("manga")
        .setDescription("Display a manga.")
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .addStringOption(option =>
            option.setName('manga')
            .setDescription('The ID/Link (mangadex only) of the manga you want to display.')
            .setRequired(true)
            
        ),

    async execute(interaction) {
        await interaction.deferReply();
        let mangaId = interaction.options.getString('manga');
        
        if (mangaId.includes("mangadex")) {
            mangaId = interaction.options.getString('manga').match(/https:\/\/mangadex\.org\/title\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\//)[1];   
        }

        let resultM;
        let resultR;
        
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
        } catch (error) {
            await interaction.editReply({ content: `${emoji.error} You entered an invalid id.`, ephemeral: true });
        }
        
        const manga = resultM.data.data;

        if (manga.attributes.contentRating == "pornographic") {
            await interaction.editReply({ content: `${emoji.error} The manga you are trying to display contains pornographic content.`, ephemeral: true });
            
        } else {
            const follow = new ButtonBuilder();
            follow.setLabel('Follow manga');
            follow.setCustomId("follow")
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
            resultR.data.statistics[mangaId].comments == null ? row.addComponents(follow, link) : row.addComponents(follow, link, comments);

            await interaction.editReply({
                files: [new AttachmentBuilder(embed.logo, embed.logoName)],
                embeds: [mangaEmbed(resultM, resultR)],
                ephemeral: false,
                components: [row]
            });
        }
    }
}