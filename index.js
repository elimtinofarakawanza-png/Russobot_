const { 
    Client, 
    Collection, 
    GatewayIntentBits, 
    Partials 
} = require("discord.js");

const fs = require("fs");
const path = require("path");

// Create client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel]
});

// Slash command collection
client.commands = new Collection();

// Load slash commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// Interaction handler
client.on("interactionCreate", async interaction
