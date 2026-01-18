const { getChatResponse } = require('../api.js');
const {saveMessage} = require("../db/db");

let autoReply = true;

function initializeAutoReply(client) {
    client.on('messageCreate', async message => {
        try {
            if (message.author.bot) return;
            if (!autoReply) return;
            if (!message.guild) return;
            if (!message.mentions.has(client.user)) return;

            await message.channel.sendTyping();

            const fetched = await message.channel.messages.fetch({limit: 50});

            const sorted = [...fetched.values()].sort(
                (a, b) => a.createdTimestamp - b.createdTimestamp
            );
            const mentionRegex = new RegExp(`<@!?${client.user.id}>`, 'g');
            const chatHistory = sorted
                .map((m) => {
                    let content = (m.content ?? '').trim();
                    if (m.author.id !== client.user.id) {
                        content = content.replace(mentionRegex, '').trim();
                    }
                    return {
                        role: m.author.id === client.user.id ? 'assistant' : 'user',
                        content,
                    };
                })
                .filter((m) => m.content.length > 0);

            const reply = await getChatResponse(chatHistory);
            await message.reply(reply);

            saveMessage(message.author.id, message.content, reply, message.guild.id);

        } catch (err) {
            console.error("Auto-respond guild error", err);
        }

    });
}

module.exports = { initializeAutoReply };