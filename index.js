const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`Russobot is online as ${client.user.tag}`);
});

// RULES COMMAND
client.on("messageCreate", (message) => {
  if (message.content === "!rules") {
    message.reply(
      "📜 **Server Rules**\n1. Be respectful\n2. No spam\n3. Follow Discord ToS\n4. Listen to staff"
    );
  }
});

// ADMIN PANEL
client.on("messageCreate", (message) => {
  if (message.content === "!admin") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("You don't have permission to use this.");
    }

    message.reply(
      "🛠️ **Russobot Admin Panel**\n- !kick @user\n- !ban @user (coming soon)\n- !timeout @user (coming soon)\n- !warn @user (coming soon)"
    );
  }
});

// KICK COMMAND
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!kick")) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("You can't use this.");
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply("Mention someone to kick.");

    await member.kick();
    message.reply(`${member.user.tag} has been kicked.`);
  }
});

client.login(process.env.TOKEN);
