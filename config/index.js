const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, '../.env')
});

dotenv.config();

module.exports = {
    botToken: process.env.DISCORD_BOT_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    guildId: process.env.DISCORD_GUILD_ID,
    verifiedRoleName: 'ape',
    generalChannelID: '1029188905423097867'
}