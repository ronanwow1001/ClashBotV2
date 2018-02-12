class WebServer
{
    /*
    Initializes a new instance of the WebServer
    */

    constructor()
    {
        this.express = require('express');
        this.http = require('http');
        this.url = require('url');
        this.fs = require('fs');
        this.app = this.express();
        this.server = this.http.createServer(this.app);
        this.bp = require('body-parser');

        this.crypto = require('crypto')
        this.algorithm = ('aes-256-ctr');
        this.password = (Config.Crypto.Password);
    }

    /*
    Starts the Web Server
    */

    start()
    {
        this.app.use(
            this.bp.json(
                {
                    limit: '50mb'
                }
            )
        );

        this.app.use(
            this.bp.urlencoded(
                {
                    limit: '50mb',
                    extended: true
                }
            )
        );

        this.server.listen(Config.WebServer.Port, () =>
            {
                Logger.info(`Server started on port: ${this.server.address().port}`);
            }
        );

        this.app.all('*', (req, res) =>
            {
              res.header('Access-Control-Allow-Origin', '*');
              res.header('Access-Control-Allow-Headers', 'Content-type');
              this.handleReq(req, res);
            }
        );
    }

    handleReq(req, res)
    {
        let url_parsed = this.url.parse(`http://${req.url}`);
        let url_path   = url_parsed.path.split('/');
        let url_filtered = url_path.filter(p => p !== '');

        if (url_filtered.includes('logs') == false)
        {
            res.sendStatus(501);
            return;
        }

        switch(req.method)
        {
            case 'OPTIONS':

                var headers = {};
                headers["Access-Control-Allow-Origin"] = "*";
                headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
                headers["Access-Control-Allow-Credentials"] = false;
                headers["Access-Control-Max-Age"] = '86400'; // 24 hours
                headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
                res.writeHead(200, headers);
                res.end();
                break;

            case 'POST':

                let key = String(req.body.key);
                let target_id = String(req.body.uid);
                let db_type = String(req.body.dbtype);

                if (key === Config.Crypto.Key)
                {
                    let path = `./u_logs/${target_id}`;
                    this.fs.readFile(`${path}/${db_type}.log`, { encoding: 'utf8' },
                    (err, data) =>
                        {
                            if (err)
                            {
                                res.sendStatus(404);
                                return;
                            }
                            else if (data)
                            {
                                let buffer = this.encrypt(`${target_id}-${db_type}`); //new Buffer(`${target_id}-${db_type}`).toString('base64');
                                res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
                                res.end(buffer);
                            }
                        }
                    );
                }
                else
                {
                    res.sendStatus(401);
                }

                break;

            case 'GET':

                let o_url = req.originalUrl.replace('/logs/', '');
                if (/^\s*$/.test(o_url) == true)
                {
                    res.sendStatus(404);
                    return;
                }

                let d_type = this.decrypt(o_url); //new Buffer(o_url, 'base64').toString('ascii');
                let b_type = d_type.split('-');
                let uid = b_type[0];
                let type_db = b_type[1];

                let path = `./u_logs/${uid}`;
                this.fs.readFile(`${path}/${type_db}.log`, { encoding: 'utf8' },
                (err, data) =>
                    {
                        if (err)
                        {
                            res.sendStatus(404);
                            return;
                        }
                        else if (data)
                        {
                            res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
                            res.end(data);
                        }
                    }
                );
                break;
        }
    }

    encrypt(text)
    {
        let cipher = this.crypto.createCipher(this.algorithm, this.password);
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');

        return crypted;
    }

    decrypt(text)
    {
        let decipher = this.crypto.createDecipher(this.algorithm, this.password)
        let dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');

        return dec;
    }
}

module.exports = WebServer;
