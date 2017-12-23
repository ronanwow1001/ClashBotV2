class MessageHandler
{
    /*
    Initializes a new instance of the Message Handler
    */

    constructor(parent)
    {
        this.parent = parent
    }

    /*
    Handles a message
    */

    handle(message)
    {
        var admin = message.member.hasPermission('ADMINISTRATOR');
        var manager = message.member.hasPermission('MANAGE_MESSAGES');
        var channel = message.channel.name;
    	var author = message.author.username;
        var uid = message.author.id;
    	var msg = message.content;
    	var date = message.createdAt;

        if (Config.Server.LogMessages === true)
        {
            Logger.debug(`(${channel}) - ${uid} - ${author}: ${msg}`);
        }

        if ((msg === '.down') && (Config.Bot.Admins.includes(uid)))
        {
            message.reply('shutting down!').then(function() { process.exit() }).catch(function() { console.log('Error shutting down!') });
        }

        if (channel)
        {
            if (Config.Server.Admins.includes(uid))
            {
              var checkMsg = 0;
            }
            else
            {
              var checkMsg = this.checkMessage(msg);
            }

            if (checkMsg === 1)
            {
              message.delete();
            }
            else
            {
                if(uid !== this.parent.bot.user.id)
                {
                    try
                    {
                        var user_data = Database.getData(`/${uid}/user_unbans[0]`);
                    }
                    catch(err)
                    {
                        Logger.error(err);
                        Database.push(`/${uid}/link_infractions[]`, {}, true);
                        Database.push(`/${uid}/suggestion_count[]`, {}, true);
                        Database.push(`/${uid}/profanity_warnings[]`, {}, true);
                        Database.push(`/${uid}/user_notes[]`, {}, true);
                        Database.push(`/${uid}/user_warnings[]`, {}, true);
                        Database.push(`/${uid}/user_kicks[]`, {}, true);
                        Database.push(`/${uid}/user_bans[]`, {}, true);
                        Database.push(`/${uid}/user_unbans[]`, {}, true);
                    }
                }
            }
        }
    }

}

module.exports = MessageHandler;
