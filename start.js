// Global Deps
global.Raven    = require('raven');
global.Config   = require('./conf/main.json');
global.readline = require('readline');
global.Logger   = require('./lib/Logger');
global.Database = require('./lib/Database');
global.Colors   = require('colors');
global.Discord  = require('discord.js');
global.Vision    = require('@google-cloud/vision');
global.Google = require('googleapis');
global.Bot      = require('./bot');
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

// Instance Google stuff
/*
Google.auth.getApplicationDefault(
    (err, authc) =>
    {
        if (err)
        {
            return cb(err);
        }
        else
        {
            if ((authc.createScopedRequired) && (authc.createScopedRequired()))
            {
                authc = authc.createScoped(['https://www.googleapis.com/auth/devstorage.read_write']);
            }
        }

        let storage = Google.storage('v1');

        storage.buckets.list(
            {
                auth: authc,
                project: projectId
            }, cb
        );
    }
);
*/

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

// Error handling;
process.on('uncaughtException',
    (error) =>
    {
        Raven.captureException(error);
        Logger.error(error)
    }
);
