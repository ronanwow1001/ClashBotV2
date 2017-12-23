var fs = require("fs");
var util = require('util');
var EOL = require('os').EOL;

// Basic Logging
module.exports.debug = debug;
module.exports.info = info;
module.exports.warn = warn;
module.exports.error = error;
module.exports.print = print;

// Custom Functions
module.exports.start = start;
module.exports.prompt = prompt;
module.exports.clear = clear;

function debug(message, tag)
{
    if (Config.Logger.Debug == false) return;

    message = util.format(message);
    write(`${getTimeString()} -${((tag) ? " [DEBUG]" : "")} ${message}`.gray)
};

function info(message)
{
    message = util.format(message);
    write(`${getTimeString()} - [INFO] ${message}`.white.bold)
};

function warn(message)
{
    message = util.format(message);
    write(`${getTimeString()} - [WARN] ${message}`.yellow.bold)
};

function error(message)
{
    message = util.format(message);
    write(`${getTimeString()} - [ERROR] ${message}`.red.bold)
};

function print(message)
{
    message = util.format(message);
    write(message);
};

// --- utils ---
function getDateTimeString()
{
    var date = new Date();
    var dy = date.getFullYear();
    var dm = date.getMonth();
    var dd = date.getDay();
    var th = date.getHours();
    var tm = date.getMinutes();
    var ts = date.getSeconds();
    var tz = date.getMilliseconds();
    dy = ("0000" + dy).slice(-4);
    dm = ("00" + dm).slice(-2);
    dd = ("00" + dd).slice(-2);
    th = ("00" + th).slice(-2);
    tm = ("00" + tm).slice(-2);
    ts = ("00" + ts).slice(-2);
    tz = ("000" + tz).slice(-3);
    return dy + "-" + dm + "-" + dd + " " + th + ":" + tm + ":" + ts;
};

function getTimeString()
{
    var date = new Date();
    var th = date.getHours();
    var tm = date.getMinutes();
    var ts = date.getSeconds();
    th = ("00" + th).slice(-2);
    tm = ("00" + tm).slice(-2);
    ts = ("00" + ts).slice(-2);
    return th + ":" + tm + ":" + ts;
};

function prompt(callback, sign)
{
    if (sign)
    {
        rl.setPrompt(sign);
        rl.question(sign, callback);
    }
    else
    {
        rl.setPrompt("# ");
        rl.question('# ', callback);
    }
}

function clear()
{
    readline.cursorTo(process.stdout, 0);
    process.stdout.write("\r\x1b[K");
    readline.clearLine(process.stdout, 0);
}

function write(message)
{
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${message}\u001B[0m${EOL}`);
    rl.prompt(true);
}

function start()
{
    console.log = (message) => info(message);
}
