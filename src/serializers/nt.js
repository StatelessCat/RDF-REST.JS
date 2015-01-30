// jshint node: true
var toNT = require('../rdfnode.js').toNT;
var Promise = require('promise');

var nt = function(graph, callback) {
    return graph.forEachTriple(null, null, null, function(s, p, o) {
        callback(toNT(s) + " " + toNT(p) + " " + toNT(o) + ".");
    });
};
exports.nt = nt;

var register = require('./factory.js').register;

register({
    contentType: 'application/n-triples',
    serializer: nt
});
register({
    contentType: 'text/plain',
    serializer: nt
});
