const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    adminOnly: true,
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute a member")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to mute")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for mute")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason");

        let muteRole = interaction.guild.roles.cache.find(r => r.name === "Muted");

        if (!muteRole) {
            muteRole = await interaction.guild.roles.create({
                name: "Muted",
                permissions: []
            });
        }

        await user.roles.add(muteRole);

        interaction.reply(`🔇 Muted ${user}.\nReason: ${reason}`);
    }
};
