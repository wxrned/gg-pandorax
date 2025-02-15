const config = require(`../config`);

module.exports = {
  name: "messageUpdate",
  async execute(client, oldMessage, newMessage) {
    if (
      !oldMessage.guild ||
      !oldMessage.channel ||
      oldMessage.author.bot ||
      oldMessage.content === newMessage.content
    )
      return;

    if (!client.editsnipes) client.editsnipes = new Map();

    const channelEdits = client.editsnipes.get(oldMessage.channel.id) || [];

    channelEdits.unshift({
      oldContent: oldMessage.content || "[No Content]",
      newContent: newMessage.content || "[No Content]",
      author: oldMessage.author.tag,
      authorId: oldMessage.author.id,
      timestamp: newMessage.editedTimestamp || Date.now(),
    });

    if (channelEdits.length > 25) channelEdits.pop();

    client.editsnipes.set(oldMessage.channel.id, channelEdits);
  },
};
