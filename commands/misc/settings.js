const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../../emojis.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Opens the settings pannel.')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1]),

    async execute(interaction) {
        await interaction.reply({ content: `${emoji.error} This command is not functional yet.`, ephemeral: true });
    }
}