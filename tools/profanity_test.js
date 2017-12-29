var swearjar = require('swearjar');
var Profane = require('profane');
var Profane = new Profane();

const Config = require('../conf/main.json');
const blacklist = Config.Blacklist;

for (var i = 0; i < blacklist.length; i++)
{
    //var is_swear = swearjar.profane(`testing swear word: ${blacklist[i]}`);
    Profane.addCategoriesForWord(blacklist[i], ["inappropriate"]);
    var is_swear = Profane.getCategoryCounts(`testing swear word: ${blacklist[i]}`);
    console.log(`${blacklist[i]} - ${is_swear.inappropriate}`);
}
