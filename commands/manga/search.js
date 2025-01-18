const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for a specific manga.')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .addStringOption(option => option.setName('name')
            .setDescription('The name that you want to search for.')
            .setRequired(true)),

    async execute(interaction) {
        await interaction.reply({ content: 'searches are coming soon!', ephemeral: true });
    }
}