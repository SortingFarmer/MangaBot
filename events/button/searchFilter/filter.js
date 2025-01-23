const { loading } = require("../../../util.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, AttachmentBuilder } = require("discord.js");
const emoji = require('../../../emojis.json');
const { embed, expire } = require('../../../config.json');


module.exports = {
    name: "filter",
    async execute(interaction, page) {
        await interaction.update(loading());

        const row1 = new ActionRowBuilder();
        const row2 = new ActionRowBuilder();
        const row3 = new ActionRowBuilder();
        const row4 = new ActionRowBuilder();
        const row5 = new ActionRowBuilder();

        if (page == 1) {
    
            const sort = new StringSelectMenuBuilder()
                .setCustomId(`sort_${interaction.user.id}_${Math.floor(Date.now()/1000) + expire}`)
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
                .setCustomId(`contentRating_${interaction.user.id}_${Math.floor(Date.now()/1000) + expire}`)
                .setPlaceholder('Choose the Content Rating(s)')
                .addOptions([
                    { label: 'Safe', value: 'safe' },
                    { label: 'Suggestive', value: 'suggestive' },
                    { label: 'Erotica', value: 'erotica' },
                ])
                .setMinValues(0)
                .setMaxValues(3);
    
            const demographic = new StringSelectMenuBuilder()
                .setCustomId(`demographic_${interaction.user.id}_${Math.floor(Date.now()/1000) + expire}`)
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
                .setCustomId(`status_${interaction.user.id}_${Math.floor(Date.now()/1000) + expire}`)
                .setPlaceholder('Choose the Status(es)')
                .addOptions([
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Hiatus', value: 'hiatus' },
                    { label: 'Cancelled', value: 'cancelled' },
                ])
                .setMinValues(0)
                .setMaxValues(4);
    
            row1.addComponents(sort);
            row2.addComponents(contentRating);
            row3.addComponents(demographic);
            row4.addComponents(status);

        } else if (page == 2) {
            
            

        }

        const cancel = new ButtonBuilder()
            .setLabel('Cancel')
            .setCustomId(`cancel_${interaction.user.id}_${Math.floor(Date.now()/1000) + expire}`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji(emoji.xx);
        const next = new ButtonBuilder()
            .setLabel('Next')
            .setCustomId(`filter.${page + 1}_${interaction.user.id}_${Math.floor(Date.now()/1000) + expire}`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(emoji.right);
        
        row5.addComponents(cancel, next);

        await interaction.editReply({
            content: "",
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
            embeds: [{
                title: `Custom Filter - Page ${page}`,
                description: `Customize the filters how you want and then click the **Next** button.\n` +
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
            components: [row1, row2, row3, row4, row5]
        });
    }
}