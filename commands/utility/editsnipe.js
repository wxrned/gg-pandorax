const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "editsnipe",
  description: "snipe edits",
  aliases: ["es"],
  cooldown: 5,
  run: async (client, message, args) => {
    const boosterRole = message.guild.roles.premiumSubscriberRole;
    const hasPermission =
      message.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      ) ||
      (boosterRole && message.member.roles.cache.has(boosterRole.id));

    if (!hasPermission) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("❌ Missing Permissions")
            .setDescription(
              "> *You need the Manage Messages permission or be a Server Booster to use this command.*"
            ),
        ],
      });
    }

    const channelId = message.channel.id;
    const snipes = client.editsnipes?.get(channelId) || [];

    if (snipes.length === 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("❌ No Edited Messages")
            .setDescription(
              "> *There are no recent edited messages in this channel.*"
            ),
        ],
      });
    }

    const snipeIndex = args[0] ? parseInt(args[0]) - 1 : 0;
    if (snipeIndex < 0 || snipeIndex >= snipes.length) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("⚠️ Invalid Index")
            .setDescription(
              `> Use a number between **1** and **${snipes.length}**.`
            ),
        ],
      });
    }

    const snipe = snipes[snipeIndex];

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({ name: snipe.author })
      .setTitle("✏️ Edited Message")
      .addFields(
        {
          name: "Before",
          value: `> ${snipe.oldContent || "[No Content]"}`,
          inline: false,
        },
        {
          name: "After",
          value: `> ${snipe.newContent || "[No Content]"}`,
          inline: false,
        }
      )
      .setFooter({
        text: `Edited at: ${new Date(snipe.timestamp).toLocaleString()}`,
      });

    message.reply({ embeds: [embed] });
  },
};
