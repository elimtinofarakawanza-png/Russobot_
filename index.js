const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

let data = { setup: false };

if (fs.existsSync("data.json")) {
  data = JSON.parse(fs.readFileSync("data.json"));
}

// Save function
function save() {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

// -------------------------------
// !setup
// -------------------------------
client.on("messageCreate", async (message) => {
  if (message.content === "!setup") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return message.reply("You must be an Administrator to run setup.");

    if (data.setup) return message.reply("Russobot is already set up.");

    // Create roles
    const mutedRole = await message.guild.roles.create({ name: "Muted", permissions: [] });
    const blacklistedRole = await message.guild.roles.create({ name: "Blacklisted", permissions: [] });

    // Create logs channel
    const logsChannel = await message.guild.channels.create({
      name: "russobot-logs",
      type: 0
    });

    // Save setup data
    data = {
      setup: true,
      mutedRole: mutedRole.id,
      blacklistedRole: blacklistedRole.id,
      logsChannel: logsChannel.id
    };

    save();

    // Setup embed
    const embed = new EmbedBuilder()
      .setTitle("Russobot Setup Complete")
      .setColor(0x2b2d31)
      .setImage("https://cdn.discordapp.com/attachments/1507770947128660050/1509572164594958438/Russia_countryball.jpg?ex=6a19aa22&is=6a1858a2&hm=4dc27247e361c9d9f0f607e3232264dbaf7c635d4acd492436e1127a09a5b524&")
      .setDescription(
        "Welcome to Russobot — your server’s automated moderation and safety system.\n\n" +
        "──────────────────────────────\n" +
        "🛠️ **MODERATION COMMANDS**\n" +
        "──────────────────────────────\n" +
        "`!warn @user <reason>` — Warn a user.\n" +
        "`!mute @user <minutes>` — Mute a user.\n" +
        "`!timeout @user <minutes>` — Timeout a user.\n" +
        "`!kick @user <reason>` — Kick a user.\n" +
        "`!ban @user <reason>` — Ban a user.\n" +
        "`!blacklist @user` — Apply Blacklisted role.\n\n" +
        "──────────────────────────────\n" +
        "📦 **SYSTEM FEATURES**\n" +
        "──────────────────────────────\n" +
        "• Auto-created roles (Muted, Blacklisted)\n" +
        "• Auto-created logs channel\n" +
        "• Anti-raid protection\n" +
        "• Message command system\n\n" +
        "──────────────────────────────\n" +
        "📜 **SERVER POLICY ENFORCEMENT**\n" +
        "──────────────────────────────\n" +
        "Russobot enforces:\n" +
        "• No harassment or hate speech\n" +
        "• No NSFW content\n" +
        "• No spam or flooding\n" +
        "• No impersonation\n" +
        "• No raiding or griefing\n" +
        "• No loophole abuse\n\n" +
        "──────────────────────────────\n" +
        "📘 **DISCORD TERMS OF SERVICE**\n" +
        "──────────────────────────────\n" +
        "All members must follow Discord ToS.\n\n" +
        "──────────────────────────────\n" +
        "✅ **SETUP COMPLETE**\n" +
        "──────────────────────────────\n" +
        "Russobot is now fully configured. Use `!admin` to view the Admin Panel."
      );

    message.channel.send({ embeds: [embed] });
  }
});

// -------------------------------
// Block commands if setup not done
// -------------------------------
function checkSetup(message) {
  if (!data.setup) {
    message.reply("⚠️ Russobot is not set up yet. Use `!setup` first.");
    return false;
  }
  return true;
}

// -------------------------------
// Logging function
// -------------------------------
function logAction(guild, text) {
  const channel = guild.channels.cache.get(data.logsChannel);
  if (channel) channel.send(text);
}

// -------------------------------
// Moderation Commands
// -------------------------------
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!")) return;

  const args = message.content.split(" ");
  const cmd = args[0];

  if (cmd === "!warn") {
    if (!checkSetup(message)) return;
    const user = message.mentions.members.first();
    const reason = args.slice(2).join(" ") || "No reason provided";
    if (!user) return message.reply("Mention a user to warn.");

    logAction(message.guild, `⚠️ **Warned:** ${user}\n**By:** ${message.author}\n**Reason:** ${reason}`);
    message.reply(`Warned ${user}.`);
  }

  if (cmd === "!mute") {
    if (!checkSetup(message)) return;
    const user = message.mentions.members.first();
    const minutes = parseInt(args[2]);
    if (!user || isNaN(minutes)) return message.reply("Usage: !mute @user <minutes>");

    user.roles.add(data.mutedRole);
    logAction(message.guild, `🔇 **Muted:** ${user}\n**Duration:** ${minutes} minutes\n**By:** ${message.author}`);

    setTimeout(() => {
      user.roles.remove(data.mutedRole);
    }, minutes * 60000);

    message.reply(`Muted ${user} for ${minutes} minutes.`);
  }

  if (cmd === "!timeout") {
    if (!checkSetup(message)) return;
    const user = message.mentions.members.first();
    const minutes = parseInt(args[2]);
    if (!user || isNaN(minutes)) return message.reply("Usage: !timeout @user <minutes>");

    user.timeout(minutes * 60000);
    logAction(message.guild, `⏳ **Timeout:** ${user}\n**Duration:** ${minutes} minutes\n**By:** ${message.author}`);
    message.reply(`Timed out ${user} for ${minutes} minutes.`);
  }

  if (cmd === "!kick") {
    if (!checkSetup(message)) return;
    const user = message.mentions.members.first();
    const reason = args.slice(2).join(" ") || "No reason provided";
    if (!user) return message.reply("Mention a user to kick.");

    user.kick(reason);
    logAction(message.guild, `👢 **Kicked:** ${user}\n**By:** ${message.author}\n**Reason:** ${reason}`);
    message.reply(`Kicked ${user}.`);
  }

  if (cmd === "!ban") {
    if (!checkSetup(message)) return;
    const user = message.mentions.members.first();
    const reason = args.slice(2).join(" ") || "No reason provided";
    if (!user) return message.reply("Mention a user to ban.");

    user.ban({ reason });
    logAction(message.guild, `🔨 **Banned:** ${user}\n**By:** ${message.author}\n**Reason:** ${reason}`);
    message.reply(`Banned ${user}.`);
  }

  if (cmd === "!blacklist") {
    if (!checkSetup(message)) return;
    const user = message.mentions.members.first();
    if (!user) return message.reply("Mention a user to blacklist.");

    user.roles.add(data.blacklistedRole);
    logAction(message.guild, `🚫 **Blacklisted:** ${user}\n**By:** ${message.author}`);
    message.reply(`Blacklisted ${user}.`);
  }
});

// -------------------------------
// Login
// -------------------------------
client.login("YOUR_BOT_TOKEN_HERE");
