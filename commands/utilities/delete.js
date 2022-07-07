module.exports = {
  name: "delete",
  aliases: "delete",
  description: "Deletes messages",
  async execute(client, message, args) {
    if (!message.member.permissions.has("MANAGE_MESSAGES"))
      return message.reply("You don't have this permission!");
    if (!args[0])
      return message.channel.send(
        "Set how many messages do you want to delete. Example <-delete 5>"
      );
    const deleteCount = Number(args[0]);
    if (
      !deleteCount ||
      deleteCount < 1 ||
      deleteCount > 100
    )
      return;

    message.channel
      .bulkDelete(deleteCount + 1)
      .then(() => {
        message.channel.send(`${args[0]} message deleted`).then(message => message.delete({ timeout: 5000 }));
      })
      .catch((error) =>
        console.log(`Couldn't delete messages because of: ${error}`)
      );
  },
};


