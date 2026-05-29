const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    adminOnly: true,
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Blacklist a member")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to blacklist")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getMember("user");

        let role = interaction.guild.roles.cache.find(r => r.name === "Blacklisted");

        if (!role) {
            role = await interaction.guild.roles.create({
                name: "Blacklisted",
                permissions: []
            });
        }

        await user.roles.add(role);

        interaction.reply(`🚫 Blacklisted ${user}.`);
    }
};
