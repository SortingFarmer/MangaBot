const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('View all mangas you have followed.')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .addNumberOption(option => option.setName('page')
            .setDescription('Go immediately to the page you want to get to.')
            .setRequired(false)),

    async execute(interaction) {
        await interaction.reply({ content: 'lists are coming soon!', ephemeral: true });
    }
}