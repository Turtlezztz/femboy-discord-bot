const {getStatus} = require("../api");


async function setBotStatus(client) {
    const status = await getStatus();

    await client.user.setPresence({
        activities: [{name: status}],
        status: 'dnd',
    });

    console.log(`Bot status set to: ${status}`);
}

module.exports = { setBotStatus };