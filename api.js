const { OpenAI } = require('openai');
require('dotenv/config');
const fs = require('fs');
const path = require('path');

const PROMPT_FILE = path.join(__dirname, 'prompt.txt');

const client = new OpenAI({
    apiKey: process.env.OPENAI_API,
});

let SYSTEM_PROMPT = '';
try {
    SYSTEM_PROMPT = fs.readFileSync(PROMPT_FILE, 'utf8').trim();
} catch (err) {
    console.error('Failed to load prompt from prompt.txt:', err);
    SYSTEM_PROMPT = '';
}

const STATUS_PROMPT =
    'Make a discord status for a femboy. It should be cute, flirty, playful and different every time.' +
    ' It should be only a couple words and fit a discord status. You should only generate one status message. ' +
    'Do not add any quotations just only the text. You have a playing status so your status should be like a ' +
    'femboy game or something else related. '


async function getChatResponse(input) {
    // Accept either a single string or a prebuilt array of { role, content }
    const chatMessages = Array.isArray(input)
        ? [{ role: 'system', content: SYSTEM_PROMPT }, ...input]
        : [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: (input ?? '').toString() },
        ];

    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: chatMessages,
    });

    return response.choices[0].message.content;
}

async function getStatus() {

    const chatMessages = Array
    ? [{ role: 'system', content: STATUS_PROMPT }, ]
    : [
        { role: 'user', content: STATUS_PROMPT },
    ];

    try {
        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: chatMessages,
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching status:', error);
        return 'I love you too! (｡♥‿♥｡)';
    }
}

module.exports = { getChatResponse, getStatus };
