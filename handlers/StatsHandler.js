class StatsHandler
{
    constructor(parent)
    {
        this.parent = parent;
    }

    getSuggestionStats(uid)
    {
        var data = Database.getData(`/${uid}/suggestion_count[0]`);
        return (data);
    }

    getProfanityStats(uid)
    {
        try
        {
            var stats = Database.getData(`/${uid}/profanity_warnings`);
            return (stats.length);
        }
        catch (err)
        {
            return (0);
        }
    }

    getModPoints(uid)
    {
        try
        {
            var stats = Database.getData(`/${uid}/user_warnings`);
            return (stats.length);
        }
        catch (err)
        {
            return (0);
        }
    }

    getKickPoints(uid)
    {
        try
        {
            var stats = Database.getData(`/${uid}/user_kicks`);
            return (stats.length);
        }
        catch (err)
        {
            return (0);
        }
    }

    getBanPoints(uid)
    {
        try
        {
            var stats = Database.getData(`/${uid}/user_bans`);
            return (stats.length);
        }
        catch (err)
        {
            return (0);
        }
    }
}

module.exports = StatsHandler;
