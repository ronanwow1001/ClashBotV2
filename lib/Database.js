const DB = require('node-json-db');

class Database
{
    /*
    Initializes a new instance of the Database
    */

    constructor(parent)
    {
        this.parent = parent
    }

    /*
    Starts the Database Server
    */

    start()
    {
        this.db = new DB("usersDB", true, true);
    }

    dbTest()
    {
        var userid_test = 1;
        this.db.push(`/${userid_test}/link_infractions[]`, {}, true);
        this.db.push(`/${userid_test}/suggestion_count[]`, {}, true);
        this.db.push(`/${userid_test}/profanity_warnings[]`, {}, true);
        this.db.push(`/${userid_test}/user_notes[]`, {}, true);
        this.db.push(`/${userid_test}/user_warnings[]`, {}, true);
        //console.log(this.db.getData("/300403718959136769/kicks[0]/id"));
    }
}

module.exports = Database;
