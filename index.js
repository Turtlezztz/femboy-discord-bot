const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection, Events, GatewayIntentBits, Partials} = require('discord.js');
const {token} = {
    token: process.env.DISCORD_BOT_TOKEN,
    clientId: process.env.DISCORD_BOT_CLIENT_ID,
    guildId: process.env.DISCORD_BOT_GUILD_ID,
};
const { initializeAutoReply } = require('./features/ping.js');
const { initializeDMReply } = require('./features/dm.js');
const { dbConnect } = require('./db/db.js');
const {setBotStatus} = require("./features/status");


const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Channel],
});
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Connect to database
dbConnect();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    initializeAutoReply(client);
    initializeDMReply(client);
    setBotStatus(client).then();
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
})


client.login(token);