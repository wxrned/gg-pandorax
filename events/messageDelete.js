const config = require(`../data/config`);

module.exports = {
  name: "messageDelete",
  tier: null,
  async execute(client, message) {
    if (!message.guild || !message.channel || message.author.bot) return;

    if (!client.snipes) client.snipes = new Map();

    const channelSnipes = client.snipes.get(message.channel.id) || [];

    channelSnipes.unshift({
      content: message.content || "[No Content]",
      author: message.author.tag,
      authorId: message.author.id,
      timestamp: message.createdTimestamp,
      attachments: message.attachments.map((a) => a.url),
    });

    if (channelSnipes.length > 10) channelSnipes.pop();

    client.snipes.set(message.channel.id, channelSnipes);
  },
};
