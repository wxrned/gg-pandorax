const { Events } = require("discord.js");

module.exports = {
  name: "presenceUpdate",
  tier: null,
  async execute(client, oldPresence, newPresence) {
    if (!newPresence || !newPresence.member || newPresence.member.user.bot) return;

    const guild = newPresence.guild;
    const targetRoleId = "1297968483123855431";
    const vanityCode = "/pandorax";

    const customStatus = newPresence.activities.find(
      (activity) => activity.type === 4 && activity.state
    );

    if (customStatus && customStatus.state.includes(vanityCode)) {
      if (!newPresence.member.roles.cache.has(targetRoleId)) {
        await newPresence.member.roles.add(targetRoleId).catch(console.error);
      }
    } else {
      if (newPresence.member.roles.cache.has(targetRoleId)) {
        await newPresence.member.roles.remove(targetRoleId).catch(console.error);
      }
    }
  },
};
