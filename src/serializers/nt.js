// jshint node: true
var toNT = require('../rdfnode.js').toNT;
var Promise = require('promise');

var nt = function(graph, callback) {
    return new Promise(function(resolve, reject) {
        graph.forEachTriple(null, null, null, function(s, p, o) {
            callback(toNT(s) + " " + toNT(p) + " " + toNT(o) + ".");
        });
        resolve();
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
