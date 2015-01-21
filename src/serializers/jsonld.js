// jshint node: true
var Promise = require('promise');

var jsonld = function(graph, callback) {
    return new Promise(function(resolve, reject) {
        callback('[');
        graph.forEachTriple(null, null, null, function(s, p, o) {
            if (o['@language']) {
                // JSON-LD does not support both @type and @language
                o = {
                    '@value': o['@value'],
                    '@language': o['@language']
                };
            }
            var triple = { '@id': s['@id'] };
            triple[p['@id']] = o;
            callback(JSON.stringify(triple) + ",");
        });
        callback('{}]');
        resolve();
    });
};
exports.jsonld = jsonld;

var register = require('./factory.js').register;

register({
    contentType: 'application/debug+json',
    serializer: jsonld
});
register({
    contentType: 'application/application+json',
    serializer: jsonld
});
register({
    contentType: 'application/json',
    serializer: jsonld
});
