require('dotenv').config()
const { read } = require('fs');
const { Bot } = require('./Bot');
const { CmdCommandHandler } = require('./Interaction/CmdCommandHandler');

const bot = new Bot(process.env.token, process.env.clientId, __dirname + '/commands');
bot.login();