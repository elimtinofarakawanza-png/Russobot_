const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    adminOnly: true,
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a member")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to warn")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the warning")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason");

        if (!user) return interaction.reply("User not found.");

        // Load violations
        let data = {};
        if (fs.existsSync("violations.json")) {
            data = JSON.parse(fs.readFileSync("violations.json"));
        }

        if (!data[user.id]) data[user.id] = [];
        data[user.id].push({
            type: "Warn",
            reason,
            date: new Date().toISOString()
        });

        fs.writeFileSync("violations.json", JSON.stringify(data, null, 2));

        interaction.reply(`⚠️ Warned ${user} for: **${reason}**`);
    }
};
