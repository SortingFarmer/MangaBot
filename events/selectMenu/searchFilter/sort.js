const { loading } = require("../../../util.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, AttachmentBuilder } = require("discord.js");
const emoji = require('../../../emojis.json');
const { embed, expire } = require('../../../config.json');

module.exports = {
    name: "sort",
    async execute(interaction) {
        await interaction.update(loading());


    }
}