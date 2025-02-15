const { EmbedBuilder } = require("discord.js");
const config = require(`../config`);
const axios = require("axios");
const fs = require("fs");

module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    let prefix = config.prefix || ",";

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd =
      client.commands.get(command) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(command)
      );

    if (!cmd) return;

    try {
      if (cmd.disabled) {
        const embed = new EmbedBuilder()
          .setColor("Yellow")
          .setTitle("⚠️ WARNING")
          .setDescription(
            `> *The command is currently disabled.*\n> \`${prefix}${command}\``
          );
        return message.reply({ embeds: [embed] });
      }

      const lastUsed = client.cooldowns.get(`cmd_${cmd.name}`) || 0;
      const remainingTime = lastUsed - Date.now();

      if (remainingTime > 0) {
        const unixTime = Math.floor(lastUsed / 1000);
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("⏳ COOLDOWN")
          .setDescription(
            `> *This command is on cooldown for you.*\n> Cooldown expires <t:${unixTime}:R>`
          );

        let msg = await message.reply({ embeds: [embed] });
        setTimeout(() => msg.delete(), 5000);
        return;
      }

      const logMessage = `[${new Date().toISOString()}] ${command} | ${args.join(
        " "
      )}\n`;
      fs.appendFile("logs/usage/commands.txt", logMessage, (err) => {
        if (err) console.error("Error logging command usage:", err);
      });

      if (cmd.cooldown && cmd.cooldown !== 0)
        client.cooldowns.set(
          `cmd_${cmd.name}`,
          Date.now() + (cmd.cooldown ? cmd.cooldown * 1000 : 0)
        );

      cmd.run(client, message, args);
    } catch (error) {
      console.error("ERROR: ", error);
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("❌ ERROR")
        .setDescription(
          `> *An error occurred while executing the command.*\n> Command: \`${prefix}${command}\``
        );
      return message.reply({ embeds: [embed] });
    }
  },
};
