class WebServer
{
    /*
    Initializes a new instance of the WebServer
    */

    constructor(port)
    {
        this.port = port
        this.express = require('express');
        this.http = require('http');
        this.url = require('url');
        this.app = this.express();
        this.server = this.http.createServer(this.app);
        this.bp = require('body-parser');
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

        this.server.listen(this.port, () =>
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

        Logger.debug(`Got url: ${url_filtered}`);
    }
}

module.exports = WebServer;
