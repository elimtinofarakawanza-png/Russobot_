const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    adminOnly: true,
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Timeout a member")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to timeout")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("minutes")
                .setDescription("Minutes to timeout")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for timeout")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getMember("user");
        const minutes = interaction.options.getInteger("minutes");
        const reason = interaction.options.getString("reason");

        if (!user) return interaction.reply("User not found.");

        await user.timeout(minutes * 60 * 1000, reason);

        interaction.reply(`⏳ Timed out ${user} for **${minutes} minutes**.\nReason: ${reason}`);
    }
};
