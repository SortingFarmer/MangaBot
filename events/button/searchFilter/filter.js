const { loading } = require("../../../util.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, AttachmentBuilder } = require("discord.js");
const emoji = require('../../../emojis.json');
const { embed } = require('../../../config.json');


module.exports = {
    name: "filter",
    async execute(interaction, page) {
        await interaction.update(loading());

        if (page == 1) {
            const sortRow = new ActionRowBuilder();
            const contentRatingRow = new ActionRowBuilder();
            const demographicRow = new ActionRowBuilder();
            const statusRow = new ActionRowBuilder();
            const buttonRow = new ActionRowBuilder();
    
            const sort = new StringSelectMenuBuilder()
                .setCustomId(`sort_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`)
                .setPlaceholder("Sort by")
                .addOptions([
                    { label: "Latest Upload", value: `{"upload":"desc"}` },
                    { label: "Oldest Upload", value: `{"upload":"asc"}` },
                    { label: "Title Ascending", value: `{"title":"asc"}` },
                    { label: "Title Descending", value: `{"title":"desc"}` },
                    { label: "Highest rating", value: `{"rating":"desc"}` },
                    { label: "Lowest rating", value: `{"rating":"asc"}` },
                    { label: "Most follows", value: `{"follows":"desc"}` },
                    { label: "Fewest follows", value: `{"follows":"asc"}` },
                    { label: "Recently added", value: `{"created":"desc"}` },
                    { label: "Oldest added", value: `{"created":"asc"}` },
                    { label: "Year Ascending", value: `{"year":"asc"}` },
                    { label: "Year Descending", value: `{"year":"desc"}` },
                ])
                .setMinValues(0)
                .setMaxValues(1);
    
            const contentRating = new StringSelectMenuBuilder()
                .setCustomId(`contentRating_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`)
                .setPlaceholder('Choose the Content Rating(s)')
                .addOptions([
                    { label: 'Safe', value: 'safe' },
                    { label: 'Suggestive', value: 'suggestive' },
                    { label: 'Erotica', value: 'erotica' },
                ])
                .setMinValues(0)
                .setMaxValues(3);
    
            const demographic = new StringSelectMenuBuilder()
                .setCustomId(`demographic_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`)
                .setPlaceholder('Choose the Demographic(s)')
                .addOptions([
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Josei', value: 'josei' },
                ])
                .setMinValues(0)
                .setMaxValues(4);
    
            const status = new StringSelectMenuBuilder()
                .setCustomId(`status_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`)
                .setPlaceholder('Choose the Status(es)')
                .addOptions([
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Hiatus', value: 'hiatus' },
                    { label: 'Cancelled', value: 'cancelled' },
                ])
                .setMinValues(0)
                .setMaxValues(4);
    
            sortRow.addComponents(sort);
            contentRatingRow.addComponents(contentRating);
            demographicRow.addComponents(demographic);
            statusRow.addComponents(status);
    
            const cancel = new ButtonBuilder()
                .setLabel('Cancel')
                .setCustomId(`cancel_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`)
                .setStyle(ButtonStyle.Danger)
                .setEmoji(emoji.xx);
            const next = new ButtonBuilder()
                .setLabel('Next')
                .setCustomId(`filter.2_${interaction.user.id}_${Math.floor(Date.now()/1000) + 600}`)
                .setStyle(ButtonStyle.Success)
                .setEmoji(emoji.right);
            
            buttonRow.addComponents(cancel, next);

            await interaction.editReply({
                content: "",
                files: [new AttachmentBuilder(embed.logo, embed.logoName)],
                embeds: [{
                    title: `Custom Filter - Page 1`,
                    description: `Please select the sorting method, content rating, demographic, and status you want to filter by and then click the **Next** button.\n` +
                    `You can also use the **Cancel** button to cancel the filter and instead use the default one.`,
                    color: embed.color,
                    fields: [],
                    footer: {
                        text: embed.footNote,
                        icon_url: `attachment://${embed.logoName}`
                    },
                    timestamp: new Date().toISOString()
                }],
                ephemeral: false,
                components: [sortRow, contentRatingRow, demographicRow, statusRow, buttonRow]
            })
        } else {
            await interaction.editReply({
                content: `${emoji.error} Something went wrong, this page (${page}) doesn't exist!`,
                files: [],
                embeds: [],
                ephemeral: false,
                components: []
            })
        }
    }
}