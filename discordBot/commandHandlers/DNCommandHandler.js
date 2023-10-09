const config = require("../../config");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment, AttachmentBuilder } = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const random = require("../../utils/random");

const DN_COMMAND = "dn";
const DN_COMMAND_COMMAND_DESCRIPTION = "Show a specific Digital Nomad";

class RandomCommandHandler {
  constructor() {
    this.slashCommand = new SlashCommandBuilder()
      .setName(DN_COMMAND)
      .setDescription(DN_COMMAND_COMMAND_DESCRIPTION)
      .addIntegerOption(option =>
        option.setName('id')
          .setDescription('The token id that you would like to show')
          .setRequired(true));

  }

  /* helper to retrieve the underlying discord slash command instance */
  getCommand() {
    return this.slashCommand;
  }
  /* ---------------------------------------------------------------- */

  /* implementation */
  async handle(interaction) {

    const tokenID = interaction.options._hoistedOptions.find((f) => f.name === "id").value;

    if (tokenID < 1 || tokenID > 7000) {
      await interaction.reply({
        content: `Token ID #${tokenID} does not exist. Please select a number between 1 and 7,000`,
        ephemeral: true,
      });
    }

    await interaction.reply({
        content: `getting Digital Nomad...`,
        ephemeral: false,
    });
    let imgURL = `https://digital-nomads.s3.amazonaws.com/img/${tokenID}.png`;
    if (tokenID === 6238 || tokenID === 6923) {
      imgURL = `https://digital-nomads.s3.amazonaws.com/img/${tokenID}.gif`;
    }

    const embedFileObject = new  EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`Digital Nomad #${tokenID}`)
    .setImage(imgURL); 
   
    await interaction.editReply({
        content: ``,
        ephemeral: false,
        embeds: [embedFileObject],
    });
  }
}

module.exports = new RandomCommandHandler();