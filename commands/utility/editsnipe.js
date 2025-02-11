const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "editsnipe",
  description: "Snipe the last edited message in the channel.",
  aliases: ["es"],
  cooldown: 5,
  run: async (client, message, args) => {
    const channelId = message.channel.id;
    const snipes = client.editsnipes?.get(channelId) || [];

    if (snipes.length === 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("❌ No Edits")
            .setDescription("> *There are no recent edited messages in this channel.*"),
        ],
      });
    }

    const snipeIndex = args[0] ? parseInt(args[0]) - 1 : 0;
    if (snipeIndex < 0 || snipeIndex >= snipes.length) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("⚠️ Invalid Snipe Index")
            .setDescription(`Use a number between **1** and **${snipes.length}**.`),
        ],
      });
    }

    const snipe = snipes[snipeIndex];

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({ name: snipe.author })
      .setTitle("✏️ Edited Message")
      .addFields(
        { name: "Before", value: snipe.oldContent || "[No Content]", inline: false },
        { name: "After", value: snipe.newContent || "[No Content]", inline: false }
      )
      .setFooter({ text: `Edited at: ${new Date(snipe.timestamp).toLocaleString()}` });

    message.reply({ embeds: [embed] });
  },
};
