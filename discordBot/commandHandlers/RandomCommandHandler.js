const config = require("../../config");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment, AttachmentBuilder } = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const random = require("../../utils/random");

const RANDOM_COMMAND = "random";
const RANDOM_COMMAND_COMMAND_DESCRIPTION = "Show a random Digital Nomad";

class RandomCommandHandler {
  constructor() {
    this.slashCommand = new SlashCommandBuilder()
      .setName(RANDOM_COMMAND)
      .setDescription(RANDOM_COMMAND_COMMAND_DESCRIPTION);
  }

  /* helper to retrieve the underlying discord slash command instance */
  getCommand() {
    return this.slashCommand;
  }
  /* ---------------------------------------------------------------- */

  /* implementation */
  async handle(interaction) {

    await interaction.reply({
        content: `getting random Digital Nomad...`,
        ephemeral: false,
    });
    const randomID = random.getRandomInt(1, 7000);
    let randomImgURL = `https://digital-nomads.s3.amazonaws.com/img/${randomID}.png`;
    if (randomID === 6238 || randomID === 6923) {
        randomImgURL = `https://digital-nomads.s3.amazonaws.com/img/${randomID}.gif`;
    }

    const embedFileObject = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`Digital Nomad #${randomID}`)
    .setImage(randomImgURL); 
   
    await interaction.editReply({
        content: ``,
        ephemeral: false,
        embeds: [embedFileObject],
    });
  }
}

module.exports = new RandomCommandHandler();