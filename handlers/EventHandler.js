class EventHandler
{
    constructor(parent)
    {
        this.parent = parent;
    }

    async handleJoin()
    {
        //var self = this.pa;
        var guild = this.parent.bot.guilds.array();
        await Logger.warn(`${this.parent.bot.user.username} joined the server: ${this.parent.bot.guilds.array()}`);
        await this.parent.bot.user.setAvatar('assets/images/_icon.png');
        await this.parent.bot.user.setGame('Corporate Clash');
    }

    async handleBan(guild, user)
    {
        if (Config.Server.LogMessages === true)
        {
            //Logger.debug(`(${channel}) - ${uid} - ${author}: ${msg}`);

            const embed = new Discord.RichEmbed()
              .setDescription(`${user.username} has been banned from the server.`)

              .setColor('#800080')
              .setFooter("© Corporate Clash 2017-2018")

              .setTimestamp()
              .setImage(user.avatarURL)
              .addField('**Guild Name**', guild.name, true)
              .addField('**User ID**', user.id, true)
              .addField('**Username**', user.username, true)
              .addField('**Tag**', user.tag, true)
              .addField('**Avatar URL**', user.avatarURL, true)
              .addField('**Is bot?**', user.bot, true)
              .addField('**Account Creation**', user.createdAt, true)

            await this.parent.msg_hndler.sendChannelMessage(embed, Config.Server.Channels.Logging);
        }
    }

    async handleUnban(guild, user)
    {
        if (Config.Server.LogMessages === true)
        {
            //Logger.debug(`(${channel}) - ${uid} - ${author}: ${msg}`);

            const embed = new Discord.RichEmbed()
              .setDescription(`${user.username} has been unbanned from the server.`)

              .setColor('#800080')
              .setFooter("© Corporate Clash 2017-2018")

              .setTimestamp()
              .setImage(user.avatarURL)
              .addField('**Guild Name**', guild.name, true)
              .addField('**User ID**', user.id, true)
              .addField('**Username**', user.username, true)
              .addField('**Tag**', user.tag, true)
              .addField('**Avatar URL**', user.avatarURL, true)
              .addField('**Is bot?**', user.bot, true)
              .addField('**Account Creation**', user.createdAt, true)

            await this.parent.msg_hndler.sendChannelMessage(embed, Config.Server.Channels.Logging);
        }
    }

    async handleRemoval(g_member)
    {
        var user = g_member.user;

        if (Config.Server.LogMessages === true)
        {
            //Logger.debug(`(${channel}) - ${uid} - ${author}: ${msg}`);

            const embed = new Discord.RichEmbed()
              .setDescription(`${user.username} has been removed or kicked from the server.`)

              .setColor('#800080')
              .setFooter("© Corporate Clash 2017-2018")

              .setTimestamp()
              .setImage(user.avatarURL)
              .addField('**User ID**', user.id, true)
              .addField('**Username**', user.username, true)
              .addField('**Tag**', user.tag, true)
              .addField('**Avatar URL**', user.avatarURL, true)
              .addField('**Is bot?**', user.bot, true)
              .addField('**Account Creation**', user.createdAt, true)

            await this.parent.msg_hndler.sendChannelMessage(embed, Config.Server.Channels.Logging);
        }
    }
}

module.exports = EventHandler;
