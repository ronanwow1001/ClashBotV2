const http = require('http');
const url = require('url');

class WebServer
{
    /*
    Initializes a new instance of the WebServer
    */

    constructor(port)
    {
        this.port = port
    }

    /*
    Starts the Web Server
    */

    start()
    {
        // TEST: POST @ http://localhost:777/test/url/
        // Output: Got url: test,url

        this.core = http.createServer(
            (req, res) =>
            {
                let url_parsed = url.parse(`http://${req.url}`);
                let url_path   = url_parsed.path.split('/');
                let url_filtered = url_path.filter(p => p !== '');

                Logger.debug(`Got url: ${url_filtered}`);
            }
        );

        this.core.listen(this.port);
    }
}

module.exports = WebServer;
