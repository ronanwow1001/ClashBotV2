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
        if (message.author.bot === true)
        {
            return;
        }

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
            // Check that the user has data, if not then create the dummy data
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

            if (Config.Server.Admins.includes(uid))
            {
                var checkMsg = 0;
            }
            else
            {
                var checkMsg = this.checkProfanity(msg);
            }

            if (checkMsg[0] === 1)
            {
                Database.push(`/${uid}/profanity_warnings[]/`, {
                    content: msg,
                    detected_word: checkMsg[1]
                }, true);

                const embed = new Discord.RichEmbed()
                  .setDescription('Our bot has detected you swearing!\nPlease remember no NFSW language is allowed in the Corporate Clash discord.\n')
                  .setAuthor(author, this.getAvatar(message))

                  .setColor('#FF0000')
                  .setFooter("© Corporate Clash 2017-2018")

                  .setTimestamp()
                  .addField('**Message**', "```" + msg + "```")
                  .addField('**Detected Word**', "```" + checkMsg[1] + "```");

                 message.author.send(
                     {
                         embed
                     }
                 );

                message.delete();
            }
            else
            {
                //this.processMessage(message);
            }
        }
    }

    /*
    Handles a deleted message
    */

    handleDelete(message)
    {
        if (message.author.bot === true)
        {
            return;
        }

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

            const embed = new Discord.RichEmbed()
              .setDescription(`A message by ${author} has been deleted.`)
              .setAuthor(author, this.getAvatar(message))

              .setColor('#800080')
              .setFooter("© Corporate Clash 2017-2018")

              .setTimestamp()
              .addField('**Original Message**', "```" + msg + "```")
              .addField('**Channel**', "```#" + channel + "```")
              .addField('**User ID**', "```" + uid + "```");

            this.sendChannelMessage(embed, Config.Server.Channels.Logging);
        }
    }

    handleEdit(old_message, new_message)
    {
        if (new_message.author.bot === true)
        {
            return;
        }

        var admin = new_message.member.hasPermission('ADMINISTRATOR');
        var manager = new_message.member.hasPermission('MANAGE_MESSAGES');
        var channel = new_message.channel.name;
    	var author = new_message.author.username;
        var uid = new_message.author.id;
    	var msg = new_message.content;
        var omsg = old_message.content;
    	var date = new_message.createdAt;

        if (Config.Server.LogMessages === true)
        {
            Logger.debug(`EDITED message: (${channel}) - ${uid} - ${author}: ${msg}`);

            const embed = new Discord.RichEmbed()
              .setDescription(`A message by ${author} has been edited.`)
              .setAuthor(author, this.getAvatar(new_message))

              .setColor('#800080')
              .setFooter("© Corporate Clash 2017-2018")

              .setTimestamp()
              .addField('**Original Message**', "```" + omsg + "```")
              .addField('**Edited Message**', "```" + msg + "```")
              .addField('**Channel**', "```#" + channel + "```")
              .addField('**User ID**', "```" + uid + "```");

            this.sendChannelMessage(embed, Config.Server.Channels.Logging);
        }

        if (channel)
        {

            if (Config.Server.Admins.includes(uid))
            {
                var checkMsg = 0;
            }
            else
            {
                var checkMsg = this.checkProfanity(msg);
            }

            if (checkMsg[0] === 1)
            {
                Database.push(`/${uid}/profanity_warnings[]/`, {
                    content: msg,
                    detected_word: checkMsg[1]
                }, true);

                const embed = new Discord.RichEmbed()
                  .setDescription('Our bot has detected you swearing!\nPlease remember no NFSW language is allowed in the Corporate Clash discord.\n')
                  .setAuthor(author, this.getAvatar(new_message))

                  .setColor('#FF0000')
                  .setFooter("© Corporate Clash 2017-2018")

                  .setTimestamp()
                  .addField('**Original Message**', "```" + omsg + "```")
                  .addField('**Edited Message**', "```" + msg + "```")
                  .addField('**Detected Word**', "```" + checkMsg[1] + "```");

                 new_message.author.send(
                     {
                         embed
                     }
                 );

                 if (Config.Server.LogMessages === true)
                 {

                     const embed = new Discord.RichEmbed()
                       .setDescription(`A message by ${author} that had been edited, has been deleted.`)
                       .setAuthor(author, this.getAvatar(new_message))

                       .setColor('#FF0000')
                       .setFooter("© Corporate Clash 2017-2018")

                       .setTimestamp()
                       .addField('**Original Message**', "```" + omsg + "```")
                       .addField('**Edited Message**', "```" + msg + "```")
                       .addField('**Detected Word**', "```" + checkMsg[1] + "```")
                       .addField('**Channel**', "```#" + channel + "```")
                       .addField('**User ID**', "```" + uid + "```");

                     this.sendChannelMessage(embed, Config.Server.Channels.Moderation);
                 }

                new_message.delete();
            }
            else
            {
                //this.processMessage(message);
            }
        }
    }

    sendChannelMessage(msg, channel)
    {
        var guildUser = this.parent.bot.guilds.array()[0].me;
        var channel = guildUser.guild.channels.find('name', channel);
        channel.send(msg);
    }

    checkProfanity(msg)
    {
        msg = msg.replace(/[^0-9a-z]/gi, '');
        this.check = 0;
        this.d_word = ""
        var arr = [];

        for (var i = 0; i < Config.Blacklist.length; i++)
        {
          var bWord = Config.Blacklist[i];
          var regex = new RegExp(bWord, 'gi');
          var check = msg.match(regex);
          if (check !== null)
          {
              this.d_word = bWord;
              this.check = 1;
          }
      }

      return [this.check, this.d_word];
    }

    getAvatar(message)
    {
        return message.guild.members.get(message.author.id).user.avatarURL;
    }

}

module.exports = MessageHandler;
