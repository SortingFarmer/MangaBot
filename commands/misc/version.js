const { SlashCommandBuilder } = require('@discordjs/builders');
const { version, license } = require('../../package.json');
const { embed } = require('../../config.json');
const { AttachmentBuilder } = require('discord.js');
const e = require('cors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('Shows the version of the bot.'),

    async execute(interaction) {
        await interaction.reply({
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
            embeds: [{
                title: "Version",
                description: `The current version of the bot is **${version}**.\n` +
                `This bot is under the ${license} license.`,
                color: embed.color,
                footer: {
                    text: embed.footNote,
                    icon_url: `attachment://${embed.logoName}`
                },
                timestamp: new Date().toISOString()
            }],
            ephemeral: false
        });
    }
}