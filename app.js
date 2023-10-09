const logger = require("./utils/logger");
const DiscordBot = require("./discordBot");

const startBot = async() => {
  logger.info(`starting discord bot: ${__dirname}...`);
  await DiscordBot.start();
  logger.info(`${__dirname} discord bot started...`);
}
startBot();