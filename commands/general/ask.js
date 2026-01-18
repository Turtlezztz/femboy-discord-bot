const { SlashCommandBuilder } = require('discord.js');
const { getChatResponse } = require('../../api.js');
const { saveMessage } = require('../../db/db.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Replies to the user with a message in a femboy style')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('What do you want to ask?')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply(); // Defer immediately

        const userMessage = interaction.options.getString('message');
        let reply = await getChatResponse(userMessage);

        await interaction.editReply({
            content: reply

        });

        // Save the message to the database
        saveMessage(interaction.user.id, userMessage, reply, interaction.guildId);
    }
}