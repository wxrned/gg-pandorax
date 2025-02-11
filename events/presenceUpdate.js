const { Events } = require("discord.js");

module.exports = {
  name: "presenceUpdate",
  tier: null,
  async execute(client, oldPresence, newPresence) {
    if (!newPresence || !newPresence.member || newPresence.member.user.bot) return;

    const guild = newPresence.guild;
    const targetRoleId = "1297968483123855431";
    const vanityCode = "/pandorax";

    // Check if the user has a custom status
    const customStatus = newPresence.activities.find(
      (activity) => activity.type === 4 && activity.state
    );

    if (customStatus && customStatus.state.includes(vanityCode)) {
      // Add role if the user is promoting the vanity invite
      if (!newPresence.member.roles.cache.has(targetRoleId)) {
        await newPresence.member.roles.add(targetRoleId).catch(console.error);
        console.log(`Gave role to ${newPresence.member.user.tag} for promoting vanity URL.`);
      }
    } else {
      // Remove role if the user is no longer promoting the invite
      if (newPresence.member.roles.cache.has(targetRoleId)) {
        await newPresence.member.roles.remove(targetRoleId).catch(console.error);
        console.log(`Removed role from ${newPresence.member.user.tag} for no longer promoting.`);
      }
    }
  },
};
