const { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const { embed } = require("../../config.json");
const { logger, loading } = require('../../util.js');
const emoji = require("../../emojis.json");
const { User, SearchTemplate } = require('../../db.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("browse")
        .setDescription("Browse some mangas.")
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1]),
    async execute(interaction) {
        await interaction.deferReply(loading());

        User.update({page: 0, currentSearch: {
            contentRating: ['safe', 'suggestive', 'erotica'],
        }, order: {
            "rating": "desc",
            "followedCount": "desc"
        }}, { where: { userId: interaction.user.id }}).catch((error) => {
            logger.error(error)
        })

        let savedTemplates = SearchTemplate.findAll({ where: { userId: interaction.user.id }});
        let templates = [];
        for (const template in savedTemplates) {
            templates.push({ label: template.name, value: template.templateId})
        }

        const search = new StringSelectMenuBuilder();
        search.setPlaceholder('Use a custom search template');
        search.setCustomId(`searchTemplate_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`);
        search.addOptions(templates);
        search.setMaxValues(1);

        const noFilter = new ButtonBuilder();
        noFilter.setLabel("Use default filter");
        noFilter.setCustomId(`search_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`);
        noFilter.setStyle(ButtonStyle.Success);
        noFilter.setEmoji(emoji.infos);

        const filter = new ButtonBuilder();
        filter.setLabel("Create custom filter");
        filter.setCustomId(`filter.1_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`);
        filter.setStyle(ButtonStyle.Primary);
        filter.setEmoji(emoji.question);

        const row = new ActionRowBuilder();
        row.addComponents(search);
        const row2 = new ActionRowBuilder();
        row2.addComponents(noFilter, filter);

        await interaction.editReply({
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
            embeds: [{
                title: "Browse",
                description: "Welcome to the browse menu. Here you can browse through a list of mangas.\n" +
                `First you have to choose wether you want to use the prebuilt filters or create your own.\n` +
                `The buttons to choose are found at the bottom.`,
                color: embed.color,
                fields: [{
                    name: "**Default filter:**",
                    value: `The default filter filters by Highest raing.\n` +
                        `It does not deny or specifically search for any tags.\n` +
                        `It allows any original languages, artists, authors, status, demographics and publication years.\n` +
                        `It doesn't allow pornographic content.\n` +
                        `It also doesn't check if it has any translated languages.`
                }, {
                    name: "**Customizing options:**",
                    value: `Here are all of the options you can customize:\n` +
                        `- How to sort the mangas\n` +
                        `- What tags to include and exclude\n` +
                        `- Which original languages to allow/deny\n` +
                        `- What authors and artists are allowed or denied\n` +
                        `- The publication status and its demographics\n` +
                        `- If it has specific languages translated\n` +
                        `- The content rating (except pornographic)`
                }],
                footer: {
                    text: embed.footNote,
                    icon_url: `attachment://${embed.logoName}`
                },
                timestamp: new Date().toISOString()
            }],
            ephemeral: false,
            components: templates.length == 0 ? [row2] : [row, row2]
        });
    }
}