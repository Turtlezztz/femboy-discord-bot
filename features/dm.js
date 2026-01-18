const { getChatResponse } = require('../api.js');
const {saveMessage} = require("../db/db");

function initializeDMReply(client) {
    client.on('messageCreate', async (message) => {
        try {
            if (message.author.bot) return;
            if (message.guild) return;

            await message.channel.sendTyping();

            const fetched = await message.channel.messages.fetch({ limit: 50 });

            const sorted = [...fetched.values()].sort(
                (a, b) => a.createdTimestamp - b.createdTimestamp
            );

            const chatHistory = sorted
                .map((m) => ({
                    role: m.author.id === client.user.id ? 'assistant' : 'user',
                    content: (m.content ?? '').trim(),
                }))
                .filter((m) => m.content.length > 0);

            const reply = await getChatResponse(chatHistory);
            await message.reply(reply);

            await saveMessage(message.author.id, message.content, reply, null)

        } catch (error) {
            console.error('Error in DM reply handler:', error);
        }
    })
}

module.exports = { initializeDMReply };
