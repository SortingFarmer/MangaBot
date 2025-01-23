const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../../emojis.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('latest')
        .setDescription('Browse through the latest updates of your followed mangas.')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .addNumberOption(option => option.setName('page')
            .setDescription('Go immediately to the page you want to get to.')
            .setRequired(false)),

    async execute(interaction) {
        await interaction.reply({ content: `${emoji.error} This command is not functional yet.`, ephemeral: true });
    }
}