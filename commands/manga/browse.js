const { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require('axios');
const { embed, mangadex } = require("../../config.json");
const emoji = require("../../emojis.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("browse")
        .setDescription("Browse some mangas."),
    async execute(interaction) {
        const noFilter = new ButtonBuilder();
        noFilter.setLabel("Use default filter");
        noFilter.setCustomId(`search_${interaction.user.id}`);
        noFilter.setStyle(ButtonStyle.Success);
        noFilter.setEmoji(emoji.infos);

        const filter = new ButtonBuilder();
        filter.setLabel("Create custom filter");
        filter.setCustomId(`filter-1_${interaction.user.id}`);
        filter.setStyle(ButtonStyle.Primary);
        filter.setEmoji(emoji.question);

        const row = new ActionRowBuilder();
        row.addComponents(noFilter, filter);

        await interaction.reply({
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
            components: [row]
        });


        /*
        const sortBy = new StringSelectMenuBuilder();
        sortBy.setCustomId("sortBy");
        sortBy.setPlaceholder("Select how the mangas are sorted.");
        sortBy.setMaxValues(1);
        sortBy.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Latest upload")
                .setValue("latest_upload"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Oldest upload")
                .setValue("oldest_upload"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Title Ascending")
                .setValue("title_asc"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Title Descending")
                .setValue("title_desc"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Highest rating")
                .setValue("highest_ating"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Lowest Rating")
                .setValue("lowest_rating"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Most follows")
                .setValue("most_follows"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Fewest follows")
                .setValue("fewest_follows"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Recently added")
                .setValue("recently_added"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Oldest added")
                .setValue("oldest_added"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Year Ascending")
                .setValue("year_asc"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Year Descending")
                .setValue("year_desc")
        );
        const row1 = new ActionRowBuilder();
        row1.addComponents(sortBy);

        const tags = new StringSelectMenuBuilder();
        tags.setCustomId("tags");
        tags.setPlaceholder("Select tags to filter the mangas.");
        tags.addOptions(

        )

        const row2 = new ActionRowBuilder();
        row2.addComponents(tags);
        */
    }
}