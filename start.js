// Global Deps
global.Config   = require('./conf/main.json');
global.readline = require('readline');
global.Logger   = require('./lib/Logger');
global.Colors   = require('colors');
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
// TODO

// Error handling
process.on('uncaughtException', (error) => Logger.error(error));
