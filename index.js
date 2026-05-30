require("./deploy-commands.js");
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
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Load staff roles
    let staffRoles = {};
    if (fs.existsSync("staffroles.json")) {
        staffRoles = JSON.parse(fs.readFileSync("staffroles.json"));
    }

    const guildRoles = staffRoles[interaction.guild.id] || [];

    // Admin-only commands
    if (command.adminOnly) {
        const hasRole = guildRoles.some(roleID =>
            interaction.member.roles.cache.has(roleID)
        );

        if (!hasRole) {
            return interaction.reply({
                content: "You must be a **staff member** to use this command.",
                ephemeral: true
            });
        }
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error executing this command.",
            ephemeral: true
        });
    }
});

// Login
client.login(process.env.TOKEN);
