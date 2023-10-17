const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, ComponentType } = require("discord.js");
const Canvas = require("canvas");
let result = [
  [],
  [],
  []
];

let row1,row2,row3;


module.exports = {
  data: new SlashCommandBuilder()
    .setName("ttt")
    .setDescription("Simple Tic-Tac-Toe Game")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Select the user whom you want to play with.")
        .setRequired(true)),
  category: "games",
  async execute(interaction) {

    let symbol, isReply, count = 0, playerTurn = true;
    let oppenent1 = await interaction.options.getUser("user");
    let player1 = await interaction.user;

    console.log(player1)

    const reply = await DrawTicTacToe(interaction, isReply = true, null, player1, oppenent1);

    const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000 });

    collector.on('collect', async (collected) => {
      count++;

      if (collected.user.id == player1.id && playerTurn) {
        symbol = "X";
        playerTurn = false;
      }
      else if (collected.user.id == oppenent1.id && !playerTurn) {
        symbol = "O";
        playerTurn = true
      }
      else {
        return interaction.followUp({
          content: "You aren't the oppenent/player in this game", ephemeral: true
        });
      }
      switch (collected.customId) {
        case "button1":
          row1.components[0].setDisabled(true)
          result[0][0] = symbol;
          DrawTicTacToe(interaction)
          break;
        case "button2":
          row1.components[1].setDisabled(true)
          result[0][1] = symbol;
          DrawTicTacToe(interaction)
          break;
        case "button3":
          row1.components[2].setDisabled(true)
          result[0][2] = symbol;
          DrawTicTacToe(interaction)
          break;
        case "button4":
          row2.components[0].setDisabled(true)
          result[1][0] = symbol;
          DrawTicTacToe(interaction)
          break;
        case "button5":
          row2.components[1].setDisabled(true)
          result[1][1] = symbol;
          DrawTicTacToe(interaction)
          break;
        case "button6":
          row2.components[2].setDisabled(true)
          result[1][2] = symbol;
          DrawTicTacToe(interaction)
          break;
        case "button7":
          row3.components[0].setDisabled(true)
          result[2][0] = symbol;
          DrawTicTacToe(interaction)
          break;
        case "button8":
          row3.components[1].setDisabled(true)
          result[2][1] = symbol;
          DrawTicTacToe(interaction)
          break;
        case "button9":
          row3.components[2].setDisabled(true)
          result[2][2] = symbol;
          DrawTicTacToe(interaction)
          break;
      }

      await 1500;

      if ((result[0][0] === result[0][1] && result[0][0] === result[0][2] && result[0][0] != null ||
        result[1][0] == result[1][1] && result[1][0] == result[1][2] && result[1][0] != null ||
        result[2][0] == result[2][1] && result[2][0] == result[2][2] && result[2][0] != null ||
        result[0][0] == result[1][0] && result[0][0] == result[2][0] && result[0][0] != null ||
        result[0][1] == result[1][1] && result[0][1] == result[2][1] && result[0][1] != null ||
        result[0][2] == result[1][2] && result[0][2] == result[2][2] && result[0][2] != null ||
        result[0][0] == result[1][1] && result[0][0] == result[2][2] && result[0][0] != null ||
        result[0][2] == result[1][1] && result[0][2] == result[2][0] && result[0][2] != null)
      ) {
        if(symbol == "X"){
          await DrawTicTacToe(interaction, null, "win", player1, null)
        }else{
          await DrawTicTacToe(interaction, null, "win", null, oppenent1)
        }
        
        collector.stop("over");
      } else if (count == 9) {

        await DrawTicTacToe(interaction, null, "tie", player1, oppenent1)
        collector.stop("time");
      }
    });
    collector.on('end', (collected, reason) => {
      if (reason == "time") {
        return interaction.editReply("Game finished cause the timer dropped 0.")
      }

    });
  }

}

const Embed = (player1, oppenent1) => {

  const BlEmbed = new EmbedBuilder()
    .setTitle("Tic-Tac-Toe")
    .setDescription(`${player1} vs ${oppenent1}`)
    .setImage(`attachment://ttt.png`)

  return BlEmbed;
}


const Buttons = (rowNumber) => {
  let button1 = new ButtonBuilder()
    .setCustomId(`button1`)
    .setLabel(`-`)
    .setStyle(ButtonStyle.Primary)
  let button2 = new ButtonBuilder()
    .setCustomId(`button2`)
    .setLabel(`-`)
    .setStyle(ButtonStyle.Primary)
  let button3 = new ButtonBuilder()
    .setCustomId(`button3`)
    .setLabel(`-`)
    .setStyle(ButtonStyle.Primary)
  let button4 = new ButtonBuilder()
    .setCustomId(`button4`)
    .setLabel(`-`)
    .setStyle(ButtonStyle.Primary)
  let button5 = new ButtonBuilder()
    .setCustomId(`button5`)
    .setLabel(`-`)
    .setStyle(ButtonStyle.Primary)
  let button6 = new ButtonBuilder()
    .setCustomId(`button6`)
    .setLabel(`-`)
    .setStyle(ButtonStyle.Primary)
  let button7 = new ButtonBuilder()
    .setCustomId(`button7`)
    .setLabel(`-`)
    .setStyle(ButtonStyle.Primary)
  let button8 = new ButtonBuilder()
    .setCustomId(`button8`)
    .setLabel(`-`)
    .setStyle(ButtonStyle.Primary)
  let button9 = new ButtonBuilder()
    .setCustomId(`button9`)
    .setLabel(`-`)
    .setStyle(ButtonStyle.Primary)

  row1 = new ActionRowBuilder()
    .addComponents(button1, button2, button3)

  row2 = new ActionRowBuilder()
    .addComponents(button4, button5, button6)

  row3 = new ActionRowBuilder()
    .addComponents(button7, button8, button9)
  if (rowNumber == 1) {
    return row1
  }
  if (rowNumber == 2) {
    return row2
  }
  if (rowNumber == 3) {
    return row3
  }
}

const DrawTicTacToe = async (interaction, isReply, reason, player1, oppenent1) => {
  const canvas = Canvas.createCanvas(201, 215);
  const context = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    "./src/images/BlankImage.png"
  );
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  context.font = "42px Clear Sans, Helvetica Neue, Arial, sans-serif";
  context.textAlign = "center";
  context.fillStyle = "#d7dadc";

  const emptySquare = await Canvas.loadImage(
    "./src/images/EmptySquare.png"
  );

  let squareSize = 62;
  let rowOffset = 0;
  let buffer = 0;

  for (var j = 0; j < 3; j++) {
    for (var i = 0; i < 3; i++) {
      context.drawImage(
        emptySquare,
        i * squareSize + buffer,
        rowOffset,
        squareSize,
        squareSize
      );
      if (result[j][i] != undefined) {
        context.fillText(
          result[j][i],
          squareSize / 2 + buffer + squareSize * i,
          rowOffset + 45
        );
      }

      buffer += 5;
    }

    buffer = 0;
    rowOffset += squareSize + 5;
  }

  var BlEmbed = Embed(player1, oppenent1);
  var attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: "ttt.png",
  });
  if (isReply) {
    return await interaction.reply({ embeds: [BlEmbed], files: [attachment], components: [Buttons(1), Buttons(2), Buttons(3)] })
  } else if (reason == "tie") {
    return await interaction.editReply({ embeds: [BlEmbed.setDescription("It's a tie")], files: [attachment],components:[]})
  } else if (reason == "win") {
    return await interaction.editReply({ embeds: [BlEmbed.setDescription(`${player1?player1:oppenent1} win.`)], files: [attachment],components:[]})
  }
  else {
    return await interaction.editReply({ embeds: [BlEmbed].setDescription, files: [attachment], components: [row1, row2, row3] })
  }

}