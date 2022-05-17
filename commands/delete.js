module.exports = {
  name: "delete",
  aliases: ":recycle: delete",
  description: "Deletes the messages",
  async execute(client, message, args) {
    if (!message.member.permissions.has("MANAGE_MESSAGES"))
      return message.reply("You don't have this permission!");
    if (!args[0])
      return message.channel.send(
        "Set how many messages do you want to delete. Example <-delete 5>"
      );
    const deleteCount = parseInt(args[0], true);
    if (!deleteCount || deleteCount < 1 || deleteCount > 100) return;

    message.channel.bulkDelete(deleteCount + 1)
      .then(message => { message.channel.send(`${args[0]} message deleted`)})
      .catch(error => console.log(`Couldn't delete messages because of: ${error}`));
  },
};
