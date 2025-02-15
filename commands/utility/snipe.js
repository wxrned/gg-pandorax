const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "snipe",
  description: "snipe messages",
  aliases: ["s"],
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
    const snipes = client.snipes?.get(channelId) || [];

    if (snipes.length === 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("❌ No Deleted Messages")
            .setDescription(
              "> *There are no recent deleted messages in this channel.*"
            ),
        ],
      });
    }

    let snipeIndex = 0;
    if (args[0]) {
      const parsedIndex = parseInt(args[0]) - 1;
      if (
        isNaN(parsedIndex) ||
        parsedIndex < 0 ||
        parsedIndex >= snipes.length
      ) {
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
      snipeIndex = parsedIndex;
    }

    const snipe = snipes[snipeIndex];

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({
        name: snipe.author,
        iconURL: `https://cdn.discordapp.com/avatars/${snipe.authorId}/avatar.png`,
      })
      .setTitle("🗑️ Deleted Message")
      .setDescription(`> ${snipe.content || "[No Content]"}`)
      .setFooter({
        text: `Deleted at: ${new Date(snipe.timestamp).toLocaleString()}`,
      });

    if (snipe.attachments.length > 0) {
      embed.setImage(snipe.attachments[0]);
      if (snipe.attachments.length > 1) {
        embed.addFields({
          name: "Additional Attachments",
          value: snipe.attachments.slice(1).join("\n"),
        });
      }
    }

    message.reply({ embeds: [embed] });
  },
};
