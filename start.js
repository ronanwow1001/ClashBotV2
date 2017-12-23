// Global Deps
global.Config   = require('./conf/main.json');
global.readline = require('readline');
global.Logger   = require('./lib/Logger');
global.Colors   = require('colors');
global.Bot      = require('./Bot');
global.rl       = readline.createInterface(
    {
        input:  process.stdin,
        output: process.stdout
    }
);

// Start deps
Logger.print("Loading Dependencies...".green.dim);
Logger.start();

// Start Bot
var bot = new Bot(this);
bot.start();

// Error handling
process.on('uncaughtException', (error) => Logger.error(error));
