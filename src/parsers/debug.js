// jshint node: true

var assert = require('assert');
var Promise = require('promise');

var Parser = function(graph) {
    if (!(this instanceof Parser)) return new Parser(graph);

    var that = this;
    var _txt = "";
    that.addChunk = function(chunk) {
        _txt += chunk;
    };
    that.finalize = function() {
        return new Promise(function(resolve, reject) {
            var json = JSON.parse(_txt);
            assert(json.length !== undefined);
            json.forEach(function(triple) {
                if (triple['@id'] === undefined) return;
                var s, p, o;
                s = { '@id': triple['@id'] };
                for (var k in triple) {
                    if (k !== '@id') {
                        p = { '@id': k };
                        o = triple[k];
                        if (o['@language'] !== undefined) {
                            o['@type'] = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString";
                        }
                    }
                }
                if (!(p && o)) {
                    throw "invalid triple structure " + triple
                }
                graph.addTriple(s, p, o);
            });
            resolve(graph);
        });
    };
};
exports.Parser = Parser;

require('./factory.js').register({
    contentType: 'application/debug+json',
    parserMaker: Parser
});
