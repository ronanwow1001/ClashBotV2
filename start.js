// Global Deps
global.Raven    = require('raven');
global.Config   = require('./conf/main.json');
global.readline = require('readline');
global.Logger   = require('./lib/Logger');
global.Database = require('./lib/Database');
global.Colors   = require('colors');
global.Discord  = require('discord.js');
global.Bot      = require('./bot');
global.Server   = require('./webserver');
global.rl       = readline.createInterface(
    {
        input:  process.stdin,
        output: process.stdout
    }
);

// Start deps
Logger.print("Loading Dependencies...".green.dim);
Raven.config(`https://${Config.Sentry.DSN1}:${Config.Sentry.DSN2}@sentry.io/${Config.Sentry.DSN3}`).install()
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

const startWebServer = async() =>
{
    try
    {
        // Start Bot
        var server = new Server(777);
        await server.start();
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
startWebServer();
startBot();

// Error handling;
process.on('uncaughtException',
    (error) =>
    {
        Raven.captureException(error);
        Logger.error(error)
    }
);
