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

            _txt = JSON.parse(_txt);

            jsonLdPro.toRDF(_txt).then(function (dataset) {
                var resultArr = dataset["@default"];
                resultArr.forEach(function (triple) {
                    graph.addTriple(iri(triple.subject.value),
                        iri(triple.predicate.value), triple.object);
                });
                if (graph) {
                    resolve(graph);
                } else {
                    reject(graph);
                }
            }, function (err) {
                console.log(err);
                reject(graph);
            });
        });
    };
};

exports.Parser = Parser;

require('./factory.js').register({
    contentType: 'application/ld+json',
    parserMaker: Parser
});
