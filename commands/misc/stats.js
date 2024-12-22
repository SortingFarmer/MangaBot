const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Shows some stats about the bot.'),

    async execute(interaction) {
        await interaction.reply({ content: 'Stats are coming soon!', ephemeral: true });
    }
}