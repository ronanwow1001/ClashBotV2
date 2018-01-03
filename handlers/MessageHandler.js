class MessageHandler
{
    /*
    Initializes a new instance of the Message Handler
    */

    constructor(parent)
    {
        this.parent = parent;
        this.linkify = require('linkifyjs');
        this.exec = require('child_process').exec;
        this.profanity = require('../lib/profanity-util');
        this.fs = require('fs');
        this.shell = require('shelljs');
    }

    /*
    Checks a message
    */

    async checkNormal(message)
    {
        if (message.author.bot === true)
        {
            return;
        }

        var channel = message.channel.name;
    	var author = message.author.username;
        var uid = message.author.id;
    	var msg = message.content;
    	var date = message.createdAt;

        if (Config.Server.LogMessages === true)
        {
            //Logger.debug(`(${channel}) - ${uid} - ${author}: ${msg}`);
        }

        if ((msg === '-down') && (Config.Server.Admins.includes(uid)))
        {
            await message.reply('shutting down!');
            await process.exit();
        }

        if ((msg === '-update') && (Config.Server.Admins.includes(uid)))
        {

            await message.reply('updating...');

            await this.exec('sh update.sh',
            (err, out, stderr) =>
                {
                    message.reply(`reply: ${out}`);
                    console.log(`${stderr}`);

                    if (err !== null)
                    {
                        console.log(`exec error: ${err}`);
                    }
                }
            );

            //await message.reply('updated code!');
        }

        if (message.channel.type == "text")
        {
            // Check that the user has data, if not then create the dummy data
            if(uid !== this.parent.bot.user.id)
            {
                try
                {
                    var user_data = Database.getData(`/${uid}/suggestion_count[0]`);
                }
                catch(err)
                {
                    if (err.message.startsWith('Can\'t find dataPath:'))
                    {
                        Database.push(`/${uid}/suggestion_count[]`, {
                            "uv": 0,
                            "dv": 0
                        }, true);
                    }
                }
            }

            if (Config.Server.Admins.includes(uid))
            {
                var checkMsg = 0;
                var checkLink = [false, ''];
            }
            else
            {
                var checkLink = this.checkLink(msg, channel);
                var checkMsg = this.checkProfanity(msg);
            }

            if (checkLink[0] === true)
            {
                Database.push(`/${uid}/link_infractions[]/`, {
                    content: msg,
                    detected_links: checkLink[1]
                }, true);

                if (msg.length >= 600)
                {
                    msg = msg.substring(0, 500);
                }

                const embed = new Discord.RichEmbed()
                  .setDescription('Our bot has detected you sending invalid links!\nPlease remember the Corporate Clash rules.\n')
                  .setAuthor(author, this.getAvatar(message))

                  .setColor('#FF0000')
                  .setFooter("© Corporate Clash 2017-2018")

                  .setTimestamp()
                  .addField('**Message**', "```" + msg + "```", true)
                  .addField('**Detected Link**', "```" + checkLink[1] + "```", true)

                 message.author.send(
                     {
                         embed
                     }
                 );

                 message.delete();
            }

            if (checkMsg[0] === 1)
            {
                Database.push(`/${uid}/profanity_warnings[]/`, {
                    content: msg,
                    detected_word: checkMsg[1]
                }, true);

                if (msg.length >= 600)
                {
                    msg = msg.substring(0, 500);
                }

                const embed = new Discord.RichEmbed()
                  .setDescription('Our bot has detected you swearing!\nPlease remember no NFSW language is allowed in the Corporate Clash discord.\n')
                  .setAuthor(author, this.getAvatar(message))

                  .setColor('#FF0000')
                  .setFooter("© Corporate Clash 2017-2018")

                  .setTimestamp()
                  .addField('**Message**', "```" + msg + "```", true)
                  .addField('**Detected Word**', "```" + checkMsg[1] + "```", true)
                  .addField('**Profanity Warnings**', "```" + this.parent.stats_hndler.getProfanityStats(uid) + "```", true);

                 message.author.send(
                     {
                         embed
                     }
                 );

                 if (Config.Server.LogMessages === true)
                 {

                     if (msg.length >= 600)
                     {
                         msg = msg.substring(0, 500);
                     }

                     const embed = new Discord.RichEmbed()
                       .setDescription(`A message by ${author} has been deleted for profanity.`)
                       .setAuthor(author, this.getAvatar(message))

                       .setColor('#FF0000')
                       .setFooter("© Corporate Clash 2017-2018")

                       .setTimestamp()
                       .addField('**Original Message**', "```" + msg + "```", true)
                       .addField('**Detected Word**', "```" + checkMsg[1] + "```", true)
                       .addField('**Channel**', "```#" + channel + "```", true)
                       .addField('**User ID**', "```" + uid + "```", true)
                       .addField('**Profanity Warnings**', "```" + this.parent.stats_hndler.getProfanityStats(uid) + "```", true);

                     this.sendChannelMessage(embed, Config.Server.Channels.Moderation);
                 }

                message.delete();
            }
            else
            {
                this.handleMessage(message);
            }
        }
    }

    /*
    Handles a deleted message
    */

    async handleDelete(message)
    {
        if (message.author.bot === true)
        {
            return;
        }

        var channel = message.channel.name;
    	var author = message.author.username;
        var uid = message.author.id;
    	var msg = message.content;
    	var date = message.createdAt;

        if (Config.Server.LogMessages === true)
        {
            //Logger.debug(`(${channel}) - ${uid} - ${author}: ${msg}`);

            if (msg.length >= 600)
            {
                msg = msg.substring(0, 500);
            }

            const embed = new Discord.RichEmbed()
              .setDescription(`A message by ${author} has been deleted.`)
              .setAuthor(author, this.getAvatar(message))

              .setColor('#800080')
              .setFooter("© Corporate Clash 2017-2018")

              .setTimestamp()
              .addField('**Original Message**', "```" + msg + "```", true)
              .addField('**Channel**', "```#" + channel + "```", true)
              .addField('**User ID**', "```" + uid + "```", true);

            this.sendChannelMessage(embed, Config.Server.Channels.Logging);
        }
    }

    /*
    Checks an edited message
    */

    async checkEdit(old_message, new_message)
    {
        if (new_message.author.bot === true)
        {
            return;
        }

        var channel = new_message.channel.name;
    	var author = new_message.author.username;
        var uid = new_message.author.id;
    	var msg = new_message.content;
        var omsg = old_message.content;
    	var date = new_message.createdAt;

        if (Config.Server.LogMessages === true)
        {
            //Logger.debug(`EDITED message: (${channel}) - ${uid} - ${author}: ${msg}`);

            if (msg.length >= 600)
            {
                msg = msg.substring(0, 500);
            }

            const embed = new Discord.RichEmbed()
              .setDescription(`A message by ${author} has been edited.`)
              .setAuthor(author, this.getAvatar(new_message))

              .setColor('#800080')
              .setFooter("© Corporate Clash 2017-2018")

              .setTimestamp()
              .addField('**Original Message**', "```" + omsg + "```", true)
              .addField('**Edited Message**', "```" + msg + "```", true)
              .addField('**Channel**', "```#" + channel + "```", true)
              .addField('**User ID**', "```" + uid + "```", true);

            this.sendChannelMessage(embed, Config.Server.Channels.Logging);
        }

        if (new_message.channel.type == "text")
        {

            if (Config.Server.Admins.includes(uid))
            {
                var checkMsg = 0;
                var checkLink = [false, ''];
            }
            else
            {
                var checkLink = this.checkLink(msg, channel);
                var checkMsg = this.checkProfanity(msg);
            }

            if (checkLink[0] === true)
            {
                Database.push(`/${uid}/link_infractions[]/`, {
                    content: msg,
                    detected_links: checkLink[1]
                }, true);

                if (msg.length >= 600)
                {
                    msg = msg.substring(0, 500);
                }

                const embed = new Discord.RichEmbed()
                  .setDescription('Our bot has detected you sending invalid links!\nPlease remember the Corporate Clash rules.\n')
                  .setAuthor(author, this.getAvatar(new_message))

                  .setColor('#FF0000')
                  .setFooter("© Corporate Clash 2017-2018")

                  .setTimestamp()
                  .addField('**Message**', "```" + msg + "```", true)
                  .addField('**Detected Link**', "```" + checkLink[1] + "```", true)

                 new_message.author.send(
                     {
                         embed
                     }
                 );

                 new_message.delete();
            }

            if (checkMsg[0] === 1)
            {
                Database.push(`/${uid}/profanity_warnings[]/`, {
                    content: msg,
                    detected_word: checkMsg[1]
                }, true);

                if (msg.length >= 600)
                {
                    msg = msg.substring(0, 500);
                }

                const embed = new Discord.RichEmbed()
                  .setDescription('Our bot has detected you swearing!\nPlease remember no NFSW language is allowed in the Corporate Clash discord.\n')
                  .setAuthor(author, this.getAvatar(new_message))

                  .setColor('#FF0000')
                  .setFooter("© Corporate Clash 2017-2018")

                  .setTimestamp()
                  .addField('**Original Message**', "```" + omsg + "```", true)
                  .addField('**Edited Message**', "```" + msg + "```", true)
                  .addField('**Detected Word**', "```" + checkMsg[1] + "```", true)
                  .addField('**Profanity Warnings**', "```" + this.parent.stats_hndler.getProfanityStats(uid) + "```", true);

                 new_message.author.send(
                     {
                         embed
                     }
                 );

                 if (Config.Server.LogMessages === true)
                 {

                     if (msg.length >= 600)
                     {
                         msg = msg.substring(0, 500);
                     }

                     const embed = new Discord.RichEmbed()
                       .setDescription(`A message by ${author} that had been edited, has been deleted for profanity.`)
                       .setAuthor(author, this.getAvatar(new_message))

                       .setColor('#FF0000')
                       .setFooter("© Corporate Clash 2017-2018")

                       .setTimestamp()
                       .addField('**Original Message**', "```" + omsg + "```", true)
                       .addField('**Edited Message**', "```" + msg + "```", true)
                       .addField('**Detected Word**', "```" + checkMsg[1] + "```", true)
                       .addField('**Channel**', "```#" + channel + "```", true)
                       .addField('**User ID**', "```" + uid + "```", true)
                       .addField('**Profanity Warnings**', "```" + this.parent.stats_hndler.getProfanityStats(uid) + "```", true);

                    this.sendChannelMessage(embed, Config.Server.Channels.Moderation);
                 }

                new_message.delete();
            }
            else
            {
                this.handleMessage(new_message);
            }
        }
    }

    /*
    Main message handler that processes messages after being checked
    */

    async handleMessage(message)
    {
        var channel = message.channel.name;
    	var author = message.author.username;
        var uid = message.author.id;
    	var msg = message.content;
    	var date = message.createdAt;
        var command_prefix = Config.Server.Prefix;

        if (channel === Config.Server.Channels.Suggestions)
        {
            await message.react("✅");
            await message.react("❌");
        }

        if (channel === Config.Server.Channels.ToonHQ)
        {
            if (msg == `${command_prefix}stats`)
            {
                var suggestion_count = this.parent.stats_hndler.getSuggestionStats(uid);
                var uv = parseInt(suggestion_count.uv);
                var dv = parseInt(suggestion_count.dv);
                var total = (uv) - (dv);

                const embed = new Discord.RichEmbed()
                  .setAuthor(`${author}'s stats`, this.getAvatar(message))

                  .setColor('#00ff00')
                  .setFooter("© Corporate Clash 2017-2018")

                  .setTimestamp()
                  .addField('**Upvotes**', `**${uv}**`, true)
                  .addField('**Downvotes**', `**${dv}**`, true)
                  .addField('**Total Score**', `**${total}**`, true)


                this.sendChannelMessage(embed, Config.Server.Channels.ToonHQ);
            }
        }

        if (channel === Config.Server.Channels.Moderation)
        {
            if ((msg.startsWith(`${command_prefix}user`)) && (this.checkPerms(message, uid) === true))
            {
                var split_msg = msg.split(' ');
                var target_id = split_msg[1];
                var g_member = message.guild.members.get(target_id)
                var u_member = g_member.user;

                if (target_id === undefined)
                {
                    message.reply('please supply the target user\'s id!')
                }
                else if (g_member === undefined)
                {
                    message.reply('this user does not exist!')
                }
                else
                {
                    const embed = new Discord.RichEmbed()
                      .setDescription('**User Information**\n')
                      .setAuthor(message.author.username, this.getAvatar(message))

                      .setColor('#33CCCC')
                      .setFooter("© Corporate Clash 2017-2018")

                      .setTimestamp()
                      .setImage(u_member.avatarURL)

                      .addField('**ID**', g_member.id, true)
                      .addField('**Username**', u_member.username, true)
                      .addField('**Tag**', u_member.tag, true)
                      .addField('**Avatar URL**', u_member.avatarURL, true)
                      .addField('**Is bot?**', u_member.bot, true)

                      .addField('**Account Creation**', u_member.createdAt, true)
                      .addField('**Highest Role**', g_member.highestRole, true)
                      .addField('**Join Date**', g_member.joinedAt, true)
                      .addField('**Display Name**', g_member.displayName, true)

                      .addField('**Profanity Warnings**', this.parent.stats_hndler.getProfanityStats(target_id), true)
                      .addField('**Moderation Warnings**', this.parent.stats_hndler.getModPoints(target_id), true)
                      .addField('**Kick Points**', this.parent.stats_hndler.getKickPoints(target_id), true)
                      .addField('**Ban Points**', this.parent.stats_hndler.getBanPoints(target_id), true)

                      .addField('**HQ Limit**', this.checkRole(target_id, Config.Roles.HQLimit), true)
                      .addField('**Art Limit**', this.checkRole(target_id, Config.Roles.ArtLimit), true)
                      .addField('**Suggestion Limit**', this.checkRole(target_id, Config.Roles.SuggestionLimit), true)
                      .addField('**Muted**', this.checkRole(target_id, Config.Roles.Mute), true)


                    this.sendChannelMessage(embed, Config.Server.Channels.Moderation);
                }
            }
            else if ((msg.startsWith(`${command_prefix}user`)) && (this.checkPerms(message, uid) === false))
            {
                message.author.send('sorry but you don\'t have the proper permissions to execute this command!')
            }

            if ((msg.startsWith(`${command_prefix}remove`)) && (this.checkPerms(message, uid) === true))
            {
                var split_msg = msg.split(' ');
                var target_id = split_msg[1];
                var g_member = message.guild.members.get(target_id)
                var log_type = this.removeFirstTwoParams(msg);
                var log_type = log_type.split(' ')[0];
                var check_type = this.checkLogType(log_type);
                var item_id = parseInt(this.removeFirstThreeParams(msg));
                var item = item_id + 1;

                if (target_id === undefined)
                {
                    message.reply('please supply the target user\'s id!')
                }
                else if (g_member === undefined)
                {
                    message.reply('this user does not exist!')
                }
                else if (/^\s*$/.test(log_type) == true)
                {
                    message.reply('please supply a log type!')
                }
                else if (check_type[0] == false)
                {
                    message.reply('please supply a valid log type!')
                }
                else if (item_id < -1)
                {
                    message.reply('please supply the item for removal!')
                }
                else
                {
                    var db_type = check_type[1];

                    await Database.delete(`/${target_id}/${db_type}[${item}]`);
                    await message.reply(`deleted item ${item_id} in /${target_id}/${db_type}/`);
                }
            }

            if ((msg.startsWith(`${command_prefix}log`)) && (this.checkPerms(message, uid) === true))
            {
                var split_msg = msg.split(' ');
                var target_id = split_msg[1];
                var g_member = message.guild.members.get(target_id)
                var log_type = this.removeFirstTwoParams(msg);
                var check_type = this.checkLogType(log_type);
                var db_type = check_type[1];

                if (target_id === undefined)
                {
                    message.reply('please supply the target user\'s id!')
                }
                else if (g_member === undefined)
                {
                    message.reply('this user does not exist!')
                }
                else if (/^\s*$/.test(log_type) == true)
                {
                    message.reply('please supply a log type!')
                }
                else if (check_type[0] == false)
                {
                    message.reply('please supply a valid log type!')
                }
                else
                {
                    let path = `./u_logs/${target_id}`;

                    this.fs.exists(path,
                    (exists) =>
                        {
                            if (exists === false)
                            {
                                this.shell.mkdir('-p', path);
                            }

                            let stream = this.fs.createWriteStream(`${path}/${db_type}.log`);

                            var p = Database.getData(`/${target_id}/${db_type}`);

                            if (log_type == 'li')
                            {
                                for (let i = 1; i < p.length; i++)
                                {
                                    let obj = p[i];
                                    let inc = i - 1;
                                    if (obj.content != undefined)
                                    {
                                        stream.write(`|${inc}| - |${obj.content}| - |${obj.detected_links}| \n\n`, 'utf8');
                                    }
                                }
                            }

                            if (log_type == 'pw')
                            {
                                for (let i = 1; i < p.length; i++)
                                {
                                    let obj = p[i];
                                    let inc = i - 1;
                                    if (obj.content != undefined)
                                    {
                                        stream.write(`|${inc}| - |${obj.content}| - |${obj.detected_word}| \n\n`, 'utf8');
                                    }
                                }
                            }

                            if ([ 'w', 'k', 'b' ].includes(log_type) === true)
                            {
                                for (let i = 1; i < p.length; i++)
                                {
                                    let obj = p[i];
                                    let inc = i - 1;
                                    console.log(obj);
                                    if (obj.reason != undefined)
                                    {
                                        stream.write(`|${inc}| - |${obj.reason}| - |${obj.invoker}:${obj.invoker_id}| \n\n`, 'utf8');
                                    }
                                }
                            }

                            if (log_type == 'n')
                            {
                                for (let i = 1; i < p.length; i++)
                                {
                                    let obj = p[i];
                                    let inc = i - 1;
                                    if (obj.content != undefined)
                                    {
                                        stream.write(`|${inc}| - |${obj.content}| - |${obj.invoker}:${obj.invoker_id}| \n\n`, 'utf8');
                                    }
                                }
                            }

                            stream.on('finish',
                            () =>
                                {
                                    let file = new Discord.Attachment(`${path}/${db_type}.log`, `${target_id}_${db_type}.log`)
                                    this.sendChannelMessage(file, Config.Server.Channels.Moderation);
                                }
                            );

                            stream.end();
                        }
                    );
                }
            }

            if ((msg.startsWith(`${command_prefix}help`)) && (this.checkPerms(message, uid) === true))
            {
                const embed = new Discord.RichEmbed()
                  .setDescription('**Commands**\n')

                  .setColor('#FF0000')
                  .setFooter("© Corporate Clash 2017-2018")

                  .setTimestamp()

                  .addField('**Mod Types**', `\n- 1 (rule)\n - 2 (other reason)\n`, true)
                  .addField('**Log Types**', `\n- li (link infractions)\n - pw (profanity warnings)\n - w (mod warnings)\n - n (mod notes)\n - k (kicks)\n - b (bans)\n`, true)
                  .addField('**Limit Types**', `\n- a (#${Config.Server.Channels.Art})\n - s (#${Config.Server.Channels.Suggestions})\n - hq (#${Config.Server.Channels.ToonHQ})\n - m (mute)`, true)

                  .addField('**Warn User**', '```' + `${command_prefix}warn <user's id> <type> <reason>` + '```', true)
                  .addField('**Kick User**', '```' + `${command_prefix}kick <user's id> <type> <reason>` + '```', true)
                  .addField('**Ban User**', '```' + `${command_prefix}ban <user's id> <#> <type> <reason>` + '```', true)
                  .addField('**Limit User**', '```' + `${command_prefix}limit <user's id> <limit type> <reason>` + '```', true)
                  .addField('**Add Note**', '```' + `${command_prefix}note <user's id> <note>` + '```', true)

                  .addField('**User Information**', '```' + `${command_prefix}user <user's id>` + '```', true)
                  .addField('**User Log**', '```' + `${command_prefix}log <user's id> <type>` + '```', true)
                  .addField('**Remove Log-Item**', '```' + `${command_prefix}remove <user's id> <type> <item id>` + '```', true)

                this.sendChannelMessage(embed, Config.Server.Channels.Moderation);
            }

            if ((msg.startsWith(`${command_prefix}limit`)) && (this.checkPerms(message, uid) === true))
            {
                var split_msg = msg.split(' ');
                var target_id = split_msg[1];
                var g_member = message.guild.members.get(target_id)
                var limit_type = this.removeFirstTwoParams(msg);
                    limit_type = limit_type.split(' ')[0];
                var check_type = this.checkLimitType(limit_type);
                var reason = this.removeFirstThreeParams(msg);

                if (target_id === undefined)
                {
                    message.reply('please supply the target user\'s id!')
                }
                else if (g_member === undefined)
                {
                    message.reply('this user does not exist!')
                }
                else if (/^\s*$/.test(limit_type) == true)
                {
                    message.reply('please supply a limit type!')
                }
                else if (check_type[0] == false)
                {
                    message.reply('please supply a valid limit type!')
                }
                else if (/^\s*$/.test(reason) == true)
                {
                    message.reply('please supply a valid reason!')
                }
                else
                {
                    var role_type = check_type[1];
                    var roles = this.parent.bot.guilds.first().roles.array();
                    var role = roles.find(r => r.name === check_type[1]);
                    var has_role = g_member.roles.find(r => r.name === check_type[1]);
                    var type = 0;

                    if (limit_type == 'a')
                    {
                        if (has_role == null)
                        {
                            g_member.addRole(role, [reason]);
                            message.reply(`user has been art limited because: ${reason}`);
                            type = 1;
                        }
                        else
                        {
                            g_member.removeRole(role, [reason]);
                            message.reply(`user has been art un-limited because: ${reason}`);
                        }
                    }

                    if (limit_type == 's')
                    {
                        if (has_role == null)
                        {
                            g_member.addRole(role, [reason]);
                            message.reply(`user has been suggestion limited because: ${reason}`);
                            type = 1;
                        }
                        else
                        {
                            g_member.removeRole(role, [reason])
                            message.reply(`user has been suggestion un-limited because: ${reason}`);
                        }
                    }

                    if (limit_type == 'm')
                    {
                        if (has_role == null)
                        {
                            g_member.addRole(role, [reason]);
                            message.reply(`user has been muted because: ${reason}`);
                            type = 1;
                        }
                        else
                        {
                            g_member.removeRole(role, [reason])
                            message.reply(`user has been unmuted because: ${reason}`);
                        }
                    }

                    if (limit_type == 'hq')
                    {
                        if (has_role == null)
                        {
                            g_member.addRole(role, [reason]);
                            message.reply(`user has been hq limited because: ${reason}`);
                            type = 1;
                        }
                        else
                        {
                            g_member.removeRole(role, [reason])

                            message.reply(`user has been hq un-limited because: ${reason}`);
                        }
                    }

                    if (type == 1)
                    {
                        const embed = new Discord.RichEmbed()
                          .setDescription('**You\'ve been give restricted in the Corporate Clash discord for violation of our terms.**\n')
                          .setAuthor(g_member.user.username, this.getAnonAvatar(message, target_id))

                          .setColor('#FF0000')
                          .setFooter("© Corporate Clash 2017-2018")

                          .setTimestamp()
                          .addField('**Role**', '```' + role.name + '```', true)
                          .addField('**Reason**', '```' + reason + '```', true)

                      try
                      {
                          g_member.user.send(
                              {
                                  embed
                              }
                          )
                      }
                      catch(err)
                      {
                          message.reply(err);
                      }
                    }
                    else
                    {
                        const embed = new Discord.RichEmbed()
                          .setDescription('**You\'re restriction from the Corporate Clash discord has been lifted.**\n')
                          .setAuthor(g_member.user.username, this.getAnonAvatar(message, target_id))

                          .setColor('#FF0000')
                          .setFooter("© Corporate Clash 2017-2018")

                          .setTimestamp()

                      try
                      {
                          g_member.user.send(
                              {
                                  embed
                              }
                          )
                      }
                      catch(err)
                      {
                          message.reply(err);
                      }
                    }
                }
            }

            if ((msg.startsWith(`${command_prefix}warn`)) && (this.checkPerms(message, uid) === true))
            {
                var split_msg = msg.split(' ');
                var target_id = split_msg[1];
                var g_member = message.guild.members.get(target_id)
                var type = this.checkType(split_msg[2]);
                var reason = this.removeFirstThreeParams(msg);

                if (target_id === undefined)
                {
                    message.reply('please supply the target user\'s id!')
                }
                else if (g_member === undefined)
                {
                    message.reply('this user does not exist!')
                }
                else if (type === undefined)
                {
                    message.reply('please supply a type warning!')
                }
                else if (type[0] === false)
                {
                    message.reply('please supply a valid type of warning!')
                }
                else if (/^\s*$/.test(reason) == true)
                {
                    message.reply('please supply a valid reason!')
                }
                else
                {
                    var user = g_member.user;

                    if (type[1] == 1)
                    {
                        var rule = parseInt(reason)
                        reason = Config.Server.Rules[rule - 1];

                        if (reason === undefined)
                        {
                            message.reply('please supply a valid reason!')
                            return;
                        }
                        else
                        {
                            Database.push(`/${target_id}/user_warnings[]/`, {
                                reason: `Rule ${rule}`,
                                invoker: `${message.author.username}`,
                                invoker_id: `${message.author.id}`
                            }, true);

                            const embed = new Discord.RichEmbed()
                              .setDescription('**You\'ve been warned in the Corporate Clash discord for violation of our terms.**\n')
                              .setAuthor(user.username, this.getAvatar(message))

                              .setColor('#FF0000')
                              .setFooter("© Corporate Clash 2017-2018")

                              .setTimestamp()
                              .addField('**Reason**', `Rule ${rule}`, true)
                              .addField('**Moderation Warnings**', this.parent.stats_hndler.getModPoints(target_id), true)
                              .addField('**Please Read**', '```' + reason + '```', true)

                          try
                          {
                              user.send(
                                  {
                                      embed
                                  }
                              )

                              message.reply(`I've warned ${user.username} for breaking rule ${rule}`)
                          }
                          catch(err)
                          {
                              message.reply(err);
                          }
                        }
                    }
                    else
                    {
                        Database.push(`/${target_id}/user_warnings[]/`, {
                            reason: `${reason}`,
                            invoker: `${message.author.username}`,
                            invoker_id: `${message.author.id}`
                        }, true);

                        const embed = new Discord.RichEmbed()
                          .setDescription('**You\'ve been warned in the Corporate Clash discord for violation of our terms.**\n')
                          .setAuthor(user.username, this.getAvatar(message))

                          .setColor('#FF0000')
                          .setFooter("© Corporate Clash 2017-2018")

                          .setTimestamp()
                          .addField('**Moderation Warnings**', this.parent.stats_hndler.getModPoints(target_id), true)
                          .addField('**Reason**', '```' + reason + '```', true)
                      try
                      {
                          user.send(
                              {
                                  embed
                              }
                          )

                          message.reply(`I've warned ${user.username} for: ${reason}`)
                      }
                      catch(err)
                      {
                          message.reply(err);
                      }
                    }
                }
            }
            if ((msg.startsWith(`${command_prefix}warn`)) && (this.checkPerms(message, uid) === false))
            {
                message.reply('sorry but you don\'t have the proper permissions to execute this command!')
            }

            if ((msg.startsWith(`${command_prefix}kick`)) && (this.checkPerms(message, uid) === true))
            {
                var split_msg = msg.split(' ');
                var target_id = split_msg[1];
                var g_member = message.guild.members.get(target_id)
                var type = this.checkType(split_msg[2]);
                var reason = this.removeFirstThreeParams(msg);

                if (target_id === undefined)
                {
                    message.reply('please supply the target user\'s id!')
                }
                else if (g_member === undefined)
                {
                    message.reply('this user does not exist!')
                }
                else if (type === undefined)
                {
                    message.reply('please supply a type kick!')
                }
                else if (type[0] === false)
                {
                    message.reply('please supply a valid type of kick!')
                }
                else if (/^\s*$/.test(reason) == true)
                {
                    message.reply('please supply a valid reason!')
                }
                else
                {
                    var user = g_member.user;

                    if (type[1] == 1)
                    {
                        var rule = parseInt(reason)
                        reason = Config.Server.Rules[rule - 1];

                        if (reason === undefined)
                        {
                            message.reply('please supply a valid reason!')
                            return;
                        }
                        else
                        {
                            Database.push(`/${target_id}/user_kicks[]/`, {
                                reason: `Rule ${rule}`,
                                invoker: `${message.author.username}`,
                                invoker_id: `${message.author.id}`
                            }, true);

                            const embed = new Discord.RichEmbed()
                              .setDescription('**You\'ve been kicked from the Corporate Clash discord for violation of our terms.**\n')
                              .setAuthor(user.username, this.getAvatar(message))

                              .setColor('#FF0000')
                              .setFooter("© Corporate Clash 2017-2018")

                              .setTimestamp()
                              .addField('**Reason**', `Rule ${rule}`, true)
                              .addField('**Kick Points**', this.parent.stats_hndler.getKickPoints(target_id), true)
                              .addField('**Please Read**', '```' + reason + '```', true)


                            try
                            {
                                user.send(
                                    {
                                        embed
                                    }
                                )

                                g_member.kick()
                            }
                            catch(err)
                            {
                                g_member.kick()
                            }

                            message.reply(`I've kicked ${user.username} for breaking rule ${rule}`)
                        }
                    }
                    else
                    {
                        Database.push(`/${target_id}/user_kicks[]/`, {
                            reason: `${reason}`,
                            invoker: `${message.author.username}`,
                            invoker_id: `${message.author.id}`
                        }, true);

                        const embed = new Discord.RichEmbed()
                          .setDescription('**You\'ve been kicked from the Corporate Clash discord for violation of our terms.**\n')
                          .setAuthor(user.username, this.getAvatar(message))

                          .setColor('#FF0000')
                          .setFooter("© Corporate Clash 2017-2018")

                          .setTimestamp()
                          .addField('**Kick Points**', this.parent.stats_hndler.getKickPoints(target_id), true)
                          .addField('**Reason**', '```' + reason + '```', true)

                      try
                      {
                          user.send(
                              {
                                  embed
                              }
                          )

                          g_member.kick()
                      }
                      catch(err)
                      {
                          g_member.kick()
                      }

                        message.reply(`I've kicked ${user.username} with the reason: ${reason}`)
                    }
                }
            }
            if ((msg.startsWith(`${command_prefix}kick`)) && (this.checkPerms(message, uid) === false))
            {
                message.reply('sorry but you don\'t have the proper permissions to execute this command!')
            }

            if ((msg.startsWith(`${command_prefix}ban`)) && (this.checkPerms(message, uid) === true))
            {
                var split_msg = msg.split(' ');
                var target_id = split_msg[1];
                var d_messages = parseInt(split_msg[2]);
                var g_member = message.guild.members.get(target_id)
                var type = this.checkType(split_msg[3]);
                var reason = this.removeFirstFourParams(msg);


                if (d_messages === undefined)
                {
                    message.reply('please supply the # of days of messages to be removed!')
                }
                else if (target_id === undefined)
                {
                    message.reply('please supply the target user\'s id!')
                }
                else if (g_member === undefined)
                {
                    message.reply('this user does not exist!')
                }
                else if (type === undefined)
                {
                    message.reply('please supply a type ban!')
                }
                else if (type[0] === false)
                {
                    message.reply('please supply a valid type of ban!')
                }
                else if (/^\s*$/.test(reason) == true)
                {
                    message.reply('please supply a valid reason!')
                }
                else
                {
                    var user = g_member.user;

                    if (type[1] == 1)
                    {
                        var rule = parseInt(reason)
                        reason = Config.Server.Rules[rule - 1];

                        if (reason === undefined)
                        {
                            message.reply('please supply a valid reason!')
                            return;
                        }
                        else
                        {
                            Database.push(`/${target_id}/user_bans[]/`, {
                                reason: `Rule ${rule}`,
                                invoker: `${message.author.username}`,
                                invoker_id: `${message.author.id}`
                            }, true);

                            const embed = new Discord.RichEmbed()
                              .setDescription('**You\'ve been kicked from the Corporate Clash discord for repeated violations of our terms.**\n')
                              .setAuthor(user.username, this.getAvatar(message))

                              .setColor('#FF0000')
                              .setFooter("© Corporate Clash 2017-2018")

                              .setTimestamp()
                              .addField('**Reason**', `Rule ${rule}`, true)
                              .addField('**Ban Points**', this.parent.stats_hndler.getBanPoints(target_id), true)
                              .addField('**Please Read**', '```' + reason + '```', true)


                            try
                            {
                                user.send(
                                    {
                                        embed
                                    }
                                )

                                g_member.ban({ 'days': d_messages, 'reason': `Rule ${rule}` })
                            }
                            catch(err)
                            {
                                g_member.ban({ 'days': d_messages, 'reason': `Rule ${rule}` })
                            }

                            message.reply(`I've banned ${user.username} for breaking rule ${rule} and ${d_messages} days of his messages have been removed.`)
                        }
                    }
                    else
                    {
                        Database.push(`/${target_id}/user_bans[]/`, {
                            reason: `${reason}`,
                            invoker: `${message.author.username}`,
                            invoker_id: `${message.author.id}`
                        }, true);

                        const embed = new Discord.RichEmbed()
                          .setDescription('**You\'ve been banned from the Corporate Clash discord for repeated violations of our terms.**\n')
                          .setAuthor(user.username, this.getAvatar(message))

                          .setColor('#FF0000')
                          .setFooter("© Corporate Clash 2017-2018")

                          .setTimestamp()
                          .addField('**Ban Points**', this.parent.stats_hndler.getBanPoints(target_id), true)
                          .addField('**Reason**', '```' + reason + '```', true)

                      try
                      {
                          user.send(
                              {
                                  embed
                              }
                          )

                          g_member.ban({ 'days': d_messages, 'reason': reason })
                      }
                      catch(err)
                      {
                          g_member.ban({ 'days': d_messages, 'reason': reason })
                      }

                        message.reply(`I've banned ${user.username} with the reason: ${reason} and ${d_messages} days of his messages have been removed.`)
                    }
                }
            }
            if ((msg.startsWith(`${command_prefix}ban`)) && (this.checkPerms(message, uid) === false))
            {
                message.reply('sorry but you don\'t have the proper permissions to execute this command!')
            }

            if ((msg.startsWith(`${command_prefix}note`)) && (this.checkPerms(message, uid) === true))
            {
                var split_msg = msg.split(' ');
                var target_id = split_msg[1];
                var g_member = message.guild.members.get(target_id)
                var reason = this.removeFirstTwoParams(msg);

                if (target_id === undefined)
                {
                    message.reply('please supply the target user\'s id!')
                }
                else if (g_member === undefined)
                {
                    message.reply('this user does not exist!')
                }
                else if (/^\s*$/.test(reason) == true)
                {
                    message.reply('please supply a valid note!')
                }
                else
                {
                    var user = g_member.user;

                    Database.push(`/${target_id}/user_notes[]/`, {
                        content: `${reason}`,
                        invoker: `${message.author.username}`,
                        invoker_id: `${message.author.id}`
                    }, true);

                    message.reply(`I've add that note to ${user.username}'s account.`)

                }
            }
            if ((msg.startsWith(`${command_prefix}note`)) && (this.checkPerms(message, uid) === false))
            {
                message.reply('sorry but you don\'t have the proper permissions to execute this command!')
            }
        }
    }

    handleReaction(reaction, user, type)
    {
        if (user.bot == true)
        {
            return;
        }

        var message = reaction.message;
        var emoji = reaction.emoji.name;
        var auth_id = message.author.id;
        var channel = message.channel.name;
        var suggestion_count = this.parent.stats_hndler.getSuggestionStats(auth_id);
        var uv = parseInt(suggestion_count.uv);
        var dv = parseInt(suggestion_count.dv);

        if (channel === Config.Server.Channels.Suggestions)
        {
            if (emoji == "✅")
            {
                if (type === 'add')
                {
                    Database.push(`/${auth_id}/suggestion_count[0]`, {
                        "uv": (uv + 1),
                        "dv": (dv)
                    }, true);
                }
                else if (type === 'remove')
                {
                    Database.push(`/${auth_id}/suggestion_count[0]`, {
                        "uv": (uv - 1),
                        "dv": (dv)
                    }, true);
                }
            }
            else if (emoji == "❌")
            {
                if (type === 'add')
                {
                    Database.push(`/${auth_id}/suggestion_count[0]`, {
                        "uv": (uv),
                        "dv": (dv + 1)
                    }, true);
                }
                else if (type === 'remove')
                {
                    Database.push(`/${auth_id}/suggestion_count[0]`, {
                        "uv": (uv),
                        "dv": (dv - 1)
                    }, true);
                }
            }
        }
    }

    checkPerms(message, uid)
    {
        if (message.guild.members.get(uid).roles.find(r => r.name === Config.Roles.Staff) !== null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    checkRole(uid, role_name)
    {
        var roles = this.parent.bot.guilds.first().members.get(uid).roles.array();

        if (roles.find(r => r.name === role_name))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    async sendChannelMessage(msg, channel)
    {
        var channels = this.parent.bot.channels.array();
        var channel = channels.find(
            (c) =>
            {
                return c.name === channel;
            }
        );

        //channel.send(msg, {split: {maxLength: 1024, char: "\n", prepend: '', append: '' }});
        channel.send(msg);
    }

    splitStr (str)
    {
        return str.match(/[^]{1,1024}/g);
    }

    checkLink(msg, channel)
    {

        if (/\s/.test(msg))
        {
            msg = msg.split(' ').join('');
        }

        var find_link = this.linkify.find(msg);
        var link_len = find_link.length;

        if (link_len > 0)
        {
            if (channel === Config.Server.Channels.ToonHQ)
            {

                for (var i = 0; i < Config.Server.Links.ToonHQ.length; i++)
                {
                  var link_2_check = Config.Server.Links.ToonHQ[i];
                  var regex = new RegExp(link_2_check, 'gi');
                  var check = msg.match(regex);
                  if (check !== null)
                  {
                      return [false, ''];
                  }
                }

                return [true, find_link[0].value];
            }
            else if (channel !== Config.Server.Channels.ToonHQ)
            {
                for (var i = 0; i < Config.Server.Links.Default.length; i++)
                {
                  var link_2_check = Config.Server.Links.Default[i];
                  var regex = new RegExp(link_2_check, 'gi');
                  var check = msg.match(regex);
                  if (check !== null)
                  {
                      return [false, ''];
                  }
                }

                return [true, find_link[0].value];
            }
            else
            {
                return [true, find_link[0].value];
            }
        }
        else
        {
            return [false, ''];
        }

    }

    checkProfanity(msg)
    {
        this.check = 0;
        this.d_word = '';

        var o_msg = msg;

        var regex=/^[0-9A-Za-z]+$/;

        if (/\s/.test(msg))
        {
            msg = msg.split(' ').join('');
        }

        if (!regex.test(msg))
        {
            msg = msg.replace(/[^0-9a-z]/gi, '');
        }

        var check_1 = this.profanity.check(msg);

        if (check_1.length <= 0)
        {
            check_1 = this.profanity.check(o_msg);

            if (check_1.length <= 0)
            {
                var od_msg = o_msg.split(' ');
                for (var i = 0; i < od_msg.length; i++)
                {
                    var n_msg = od_msg[i];

                    if (!regex.test(n_msg))
                    {
                        n_msg = n_msg.replace(/[^0-9a-z]/gi, '');
                    }

                    var check_2 = this.profanity.check(n_msg);

                    if (check_2.length > 0)
                    {
                        this.check = 1;
                        this.d_word = check_2[0];
                    }
                    else
                    {
                        this.check = 0;
                        this.d_word = check_2[0]
                    }
                }
            }
            else
            {
                this.check = 1;
                this.d_word = check_1[0];
            }
        }
        else if (check_1.length > 0)
        {
            this.check = 1;
            this.d_word = check_1[0];
        }

        return [this.check, this.d_word];
    }

    checkUnique(msg)
    {
        for (var i = 0; i < msg.length; i++)
        {
            var char = msg[i];

            for (var j = i; j <= msg.length - 1; j++)
            {
                if (char == msg[j])
                {
                    return false;
                }
            }
        }

        return true;
    }

    getAvatar(message)
    {
        return message.guild.members.get(message.author.id).user.avatarURL;
    }

    getAnonAvatar(message, id)
    {
        return message.guild.members.get(id).user.avatarURL;
    }

    checkLimitType(type)
    {
        switch(type)
        {
            case 's':
                return [true, Config.Roles.SuggestionLimit];
                break;
            case 'm':
                return [true, Config.Roles.Mute];
                break;
            case 'a':
                return [true, Config.Roles.ArtLimit];
                break;
            case 'hq':
                return [true, Config.Roles.HQLimit];
                break;
            default:
                return [false, ''];
                break;
        }
    }

    checkLogType(type)
    {
        switch(type)
        {
            case 'li':
                return [true, 'link_infractions'];
                break;
            case 'w':
                return [true, 'user_warnings'];
                break;
            case 'k':
                return [true, 'user_kicks'];
                break;
            case 'b':
                return [true, 'user_bans'];
                break;
            case 'pw':
                return [true, 'profanity_warnings'];
                break;
            case 'ub':
                return [true, 'user_unbans'];
                break;
            case 'n':
                return [true, 'user_notes'];
                break;
            default:
                return [false, ''];
                break;
        }
    }

    checkType(type)
    {
        type = parseInt(type)

        if (type == 1)
        {
            return [true, type];
        }
        else if (type == 2)
        {
            return [true, type];
        }
        else
        {
            return [false, type];
        }
    }

    removeFirstTwoParams(msg)
    {
        var split_msg = msg.split(' ');
        split_msg.shift()
        split_msg.shift()
        var join_msg = split_msg.join(' ')
        return join_msg;
    }

    removeFirstThreeParams(msg)
    {
        var split_msg = msg.split(' ');
        split_msg.shift()
        split_msg.shift()
        split_msg.shift()
        var join_msg = split_msg.join(' ')
        return join_msg;
    }

    removeFirstFourParams(msg)
    {
        var split_msg = msg.split(' ');
        split_msg.shift()
        split_msg.shift()
        split_msg.shift()
        split_msg.shift()
        var join_msg = split_msg.join(' ')
        return join_msg;
    }

}


module.exports = MessageHandler;
