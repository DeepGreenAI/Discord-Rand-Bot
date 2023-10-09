const config = require("./config");
const logger = require("./utils/logger");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const time = require("./utils/time");
const path = require("path");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

//register all discord command handlers defined in discordBot/commandHandlers directory
const commandHandlerDir = path.join(__dirname, "./discordBot/commandHandlers");
const commandHandlerFiles = fs
  .readdirSync(commandHandlerDir)
  .filter((file) => file.endsWith(".js"));
const commandHandlers = [];
commandHandlerFiles.forEach((f) => {
  commandHandlers.push(require(path.join(commandHandlerDir, f)));
});

class DiscordBot {
  constructor() {

    //discord client
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
  }

  /**
   * Retreives the Discord instance as defined in .env variable DISCORD_GUILD_ID
   * @returns Discord Guild
   */
  getGuild() {
    return this.client.guilds.cache.get(config.guildId);
  }

  /**
   * Starts the Discord Bot and adds an event listener for `interactionCreate`
   * events.
   *
   * When an `interactionCreate` event is received, forwards the event to an
   * appropriate `commandHandler`. If no `commandHandler` supporting the
   * interaction is found, ignores the interaction.
   */
  async start() {

    new REST({ version: "9" })
      .setToken(config.botToken)
      .put(
        Routes.applicationGuildCommands(
          config.clientId,
          config.guildId
        ),
        {
          body: commandHandlers
            .map((c) => c.getCommand())
            .map((c) => c.toJSON()),
        }
      )
      .then(() => {
        commandHandlers.forEach((command) => {
          let slashCommand = command.getCommand();
          logger.info(
            `Successfully registered command: '/${slashCommand.name}' | Description: '${slashCommand.description}'`
          );
        });
        logger.info("Done registering application commands.");

      })
      .catch(console.error);


    await this.client.login(config.botToken);

    this.client.once("ready", () => {
      logger.info("Discord Bot Ready!");
    });

    this.client.on("interactionCreate", async (interaction) => {
      if (interaction.isAutocomplete()) {
        const commandHandler = commandHandlers.find(
          (handler) => handler.getCommand().name === interaction.commandName
        );

        if (!commandHandler) return;
        const guild = this.getGuild();
        await commandHandler.handleAutocomplete(interaction, guild, this.client);
        return;
      }

      if (interaction.isCommand()) {
        const commandHandler = commandHandlers.find(
          (handler) => handler.getCommand().name === interaction.commandName
        );

        if (!commandHandler) return;
        const guild = this.getGuild();
        await commandHandler.handle(interaction, guild, this.client);
      }
      return;
    });

    /*this.client.on('messageReactionAdd', async (reaction, user) => {
      logger.info(reaction);
      //logger.info(JSON.stringify(reaction));
      // When a reaction is received, check if the structure is partial
      if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
          await reaction.fetch();
        } catch (error) {
          logger.error('Something went wrong when fetching the message:', error);
          // Return as `reaction.message.author` may be undefined/null
          return;
        }
      }
      
      const guild = this.getGuild();
      if (reaction.emoji.name === '🐘') {
        logger.info("user");
        logger.info(user);
        logger.info(JSON.stringify(user));
        const discordUser = await guild.members.fetch(user.id);
        const verifiedRole = await guild.roles.cache.find(role => role.name === config.verifiedRoleName);
        let hasVerifiedRole = discordUser.roles.cache.some(role => role.name === config.verifiedRoleName)

        if (hasVerifiedRole) {
          logger.info(`${user} already has verified role. No need to do anything`)
        }
        else {
          await discordUser.roles.add(verifiedRole);
          logger.info(`Finished adding role ${verifiedRole}`);
          logger.info(`Verified user ${user.tag}`);
        }
        logger.info(`user reacted with elephant to verify 🐘`);
      }
      logger.info(`user(s) have given the same reaction to this message!`);
    });*/

  }

  /**
   * Disconnects the Discord Bot from the Discord API
   */
  stop() {
    this.client.destroy();
  }
}

module.exports = new DiscordBot();
