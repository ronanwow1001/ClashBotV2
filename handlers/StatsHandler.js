class StatsHandler
{
    constructor(parent)
    {
        this.parent = parent;
    }

    getSuggestionStats(uid)
    {
        try
        {
            var data = Database.getData(`/${uid}/suggestion_count[0]`);
            return (data);
        }
        catch (err)
        {
            return (
                {
                    uv: 0,
                    dv: 0
                }
            )
        }
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
