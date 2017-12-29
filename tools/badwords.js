const Filter = require('bad-words');
const Config = require('../conf/main.json');
const blacklist = Config.Blacklist;
filter = new Filter({ list: blacklist });
//filter.addWords(blacklist);
    /*for (var i = 0; i < blacklist.length; i++)
    {
        var is_swear = filter.isProfaneLike(`testing swear word: ${blacklist[i]}`);
        console.log(`${blacklist[i]} - ${is_swear}`);
    }*/

    var is_swear = filter.isProfaneLike(`testing swear word: wasup`);
    console.log(`${is_swear}`);
