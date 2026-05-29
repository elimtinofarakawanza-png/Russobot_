const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    adminOnly: true,
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a member")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to ban")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for ban")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason");

        await user.ban({ reason });

        interaction.reply(`🔨 Banned ${user}.\nReason: ${reason}`);
    }
};
