const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    adminOnly: true,
    data: new SlashCommandBuilder()
        .setName("memberinfo")
        .setDescription("Show a member's punishment history")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to check")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        let data = {};
        if (fs.existsSync("violations.json")) {
            data = JSON.parse(fs.readFileSync("violations.json"));
        }

        const history = data[user.id] || [];

        if (history.length === 0) {
            return interaction.reply(`${user} has **no violations**.`);
        }

        const list = history
            .map(v => `• **${v.type}** — ${v.reason} (${new Date(v.date).toLocaleString()})`)
            .join("\n");

        interaction.reply(`📄 **History for ${user}:**\n${list}`);
    }
};
