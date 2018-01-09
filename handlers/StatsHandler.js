class StatsHandler
{
    constructor(parent)
    {
        this.parent = parent;
        this.sort = require('sort-array');
    }

    getTopTen()
    {
        let data_keys = Object.keys(Database.getData(`/`));
        let dataK_len = data_keys.length;
        let arr = [];

        for (let i = 0; i < dataK_len; i++)
        {
            let id = data_keys[i];
            let data = this.getSuggestionStats(id);
            let uv = parseInt(data.uv);
            let dv = parseInt(data.dv);
            let total = (uv) - (dv);

            arr.push({ 'total': total, 'uid': id });
        }

        let sorted_arr = this.sort(arr, 'total');
            sorted_arr = sorted_arr.reverse().slice(0, 10); // top 10 aka item 0 to item 10

        return sorted_arr;
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
