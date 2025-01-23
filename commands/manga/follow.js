const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../../emojis.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('follow')
        .setDescription('Follow or unfollow a manga.')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .addStringOption(option => option.setName('manga')
            .setDescription('The ID/Link (mangadex only) to follow/unfollow.')
            .setRequired(true)),

    async execute(interaction) {
        await interaction.reply({ content: `${emoji.error} This command is not functional yet.`, ephemeral: true });
    }
}