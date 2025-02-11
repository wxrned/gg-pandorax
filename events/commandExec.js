const config = require(`../data/config`);
const axios = require("axios");
const fs = require("fs");

module.exports = {
  name: "messageCreate",
  tier: null,
  async execute(client, message) {
    let prefix = "";

    if (client.configCache && client.configCache.customPrefix !== null) {
      prefix = client.configCache.customPrefix;
    } else {
      prefix = "";
    }

    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

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
        return message?.reply(
          `\`WARNING\`\n-# **${client.configCache.customPrefix}${command}** is currently disabled.`
        );
      }
      
      const lastUsed = client.cooldowns.get(`cmd_${cmd.name}`) || 0;
      const remainingTime = lastUsed - Date.now();
      
      if (remainingTime > 0) {
        const unixTime = Math.floor(lastUsed / 1000);
        let msg = await message.reply(`\`COOLDOWN\`\n-# Cooldown ends <t:${unixTime}:R>`);
      
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
      return message?.reply(
        `\`ERROR\`\n-# An error occurred while trying to execute: \`${prefix}${command}\``
      );
    }
  },
};
