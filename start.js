// Global Deps
global.Config   = require('./conf/main.json');
global.readline = require('readline');
global.Logger   = require('./lib/Logger');
global.Database = require('./lib/Database');
global.Colors   = require('colors');
global.Discord  = require('discord.js');
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

const startDatabase = async () =>
{
    try
    {
        global.Database = new Database(this);
        await Database.start();
        global.Database = Database.db;
    }
    catch(err)
    {
        Logger.error(err);
    }
}

const startBot = async() =>
{
    try
    {
        // Start Bot
        var bot = new Bot(this);
        await bot.start();
    }
    catch(err)
    {
        Logger.error(err);
    }

}

startDatabase();
startBot();

// Error handling
process.on('uncaughtException', (error) => Logger.error(error));
