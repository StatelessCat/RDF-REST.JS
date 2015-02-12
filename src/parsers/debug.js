/*eslint-env AMD*/

/*eslint-disable */
if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}
/*eslint-enable */

define(function (require, exports) {
    "use strict";

    var assert = require('assert');
    var Promise = require('promise');

    var Parser = function (graph) {
        "use strict";
        if (!(this instanceof Parser)) {
            return new Parser(graph);
        }

        var that = this;
        var _txt = "";
        that.addChunk = function (chunk) {
            _txt += chunk;
        };
        that.finalize = function () {
            var json = JSON.parse(_txt);
            assert(json.length !== undefined);
            var promises = [];
            json.forEach(function (triple) {
                if (triple['@id'] === undefined) return;
                var s, p, o;
                s = {'@id': triple['@id']};
                for (var k in triple) {
                    if (k !== '@id') {
                        p = {'@id': k};
                        o = triple[k];
                        if (o['@language'] !== undefined) {
                            o['@type'] = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString";
                        }
                    }
                }
                if (!(p && o)) {
                    throw "invalid triple structure " + triple;
                }
                promises.push(graph.addTriple(s, p, o));
            });
            return Promise.all(promises)
                .then(function () {
                    return graph;
                });
        };
    };

    exports.Parser = Parser;

    require('./factory.js').register({
        contentType: 'application/debug+json',
        parserMaker: Parser
    });
});
