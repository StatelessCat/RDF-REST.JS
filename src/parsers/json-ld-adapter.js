"use strict";

var jsonld = require('jsonld');
var Promise = require('promise');
var graph = require('../graph.js').graph;
var iri = require('../rdfnode.js').iri;

var Parser = function(graph) {
    if (!(this instanceof Parser)) {
        return new Parser(graph);
    }

    var that = this;
    var _txt = "";
    that.addChunk = function(chunk) {
        _txt += chunk;
    };
    that.finalize = function() {

        return new Promise(function (resolve, reject) {
            var jsonLdPro = new jsonld.JsonLdProcessor();

            jsonLdPro.toRDF(_txt).then(function (dataset) {
                var resultArr = dataset["@default"],
                    g = graph();

                resultArr.forEach(function (triple) {
                    g.addTriple(iri(triple.subject.value),
                        iri(triple.predicate.value), triple.object);
                });
                if (g) {
                    resolve(g);
                } else {
                    reject(g);
                }
            });
        });
    };
};

exports.Parser = Parser;

require('./factory.js').register({
    contentType: 'application/ld+json',
    parserMaker: Parser
});
