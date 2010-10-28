/* imports */
var http   = require('http'), 
    url    = require('url'), 
    qs     = require('querystring'), 
    Result = require('./result').Result;

/* constants */
const MIMETYPE_SPARQL_RESULTS_JSON = 'application/sparql-results+json'
const PORT_DEFAULT = 80;

/**
 * Endpoint wrapper object
 */
exports.Endpoint = function (endpoint, port, creds) {
    var parts = url.parse(endpoint);
    this.path = null;
    
    if (parts.pathname) {
        this.path = parts.pathname;
        delete(parts.pathname);
    }
    
    if (parts.port && !port) {
        port = parseInt(parts.port);
        delete(parts.port);
    }
    
    this.host = parts.hostname;
    
    if (!port) {
        port = PORT_DEFAULT;
    }
    
    this.client = http.createClient(port, parts.hostname);
};

exports.Endpoint.prototype = {
    /**
     * Executes a SPARQL query against the endpoint and calls 
     * callback with the resulting data object.
     * @param {string} query
     * @param {function} callback 
     */
    query: function (query, callback) {
        var responseBody = '';
        var request = this.client.request('GET', this.path + '?' + qs.stringify({'query': query}), {
            'host':   this.host, 
            'accept': MIMETYPE_SPARQL_RESULTS_JSON
        });
        request.end();
        
        // handlers
        request.on('response', function (response) {
            response.on('data', function (data) {
                responseBody += data;
            }).on('end', function () {
                // all data received
                if (response.statusCode !== 200) {
                    callback({message: 'Request error: (' + response.statusCode + ')'});
                } else {
                    var result = new Result(JSON.parse(responseBody));
                    callback(null, result);
                }
            });
        });
    }, 
};
