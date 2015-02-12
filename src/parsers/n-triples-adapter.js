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

    var N3 = require('n3');
    var Promise = require('promise');
    var graph = require('../graph.js').graph;
    var iri = require('../rdfnode.js').iri;

    /**
     * Returns a Promise that is able to serve a graph representation
     * @param ntriples
     */
    exports.toGraph = function (ntriples) {
        var aPromise = new Promise(function (resolve, reject) {
            var parser = N3.Parser(),
                g = graph();
            parser.parse(ntriples, function (error, triple) {
                if (triple) {
                    g.addTriple(iri(triple.subject),
                        iri(triple.predicate), triple.object); // on ajoute un à un les triplets
                } else {
                    // parsing is done, we can continue
                    if (g) {
                        resolve(g);
                    } else {
                        reject(new Error("g is null"));
                    }
                }
                if (error) {
                    reject(new Error("It broke"));
                }
            });
        });
        return aPromise;
    };
});
