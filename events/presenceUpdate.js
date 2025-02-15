const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
  name: "presenceUpdate",
  tier: null,
  async execute(client, oldPresence, newPresence) {
    if (!newPresence || !newPresence.member || newPresence.member.user.bot)
      return;

    const guild = newPresence.guild;
    const repRoleId = config.repRoleId;
    const repChannelId = config.repChannelId;
    const vanityCode = config.vanityCode;

    const customStatus = newPresence.activities.find(
      (activity) => activity.type === 4 && activity.state
    );

    if (customStatus && customStatus.state.includes(vanityCode)) {
      if (!newPresence.member.roles.cache.has(repRoleId)) {
        await newPresence.member.roles.add(repRoleId).catch(console.error);
        const channel = guild.channels.cache.get(repChannelId);
        if (channel)
          channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#9F2B68")
                .setDescription(`> thx for repping, ${newPresence.member.user}`)
                .setFooter({ text: `${vanityCode}` })
                .setTimestamp(),
            ],
          });
      }
    } else {
      if (newPresence.member.roles.cache.has(repRoleId)) {
        await newPresence.member.roles.remove(repRoleId).catch(console.error);
      }
    }
  },
};
