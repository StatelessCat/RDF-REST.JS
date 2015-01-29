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

            // we define a Json-LD document
            var doc = {
                "@context": {
                    "name": "http://schema.org/name",
                    "description": "http://schema.org/description",
                    "image": {
                        "@id": "http://schema.org/image",
                        "@type": "@id"
                    },
                    "geo": "http://schema.org/geo",
                    "latitude": {
                        "@id": "http://schema.org/latitude",
                        "@type": "xsd:float"
                    },
                    "longitude": {
                        "@id": "http://schema.org/longitude",
                        "@type": "xsd:float"
                    },
                    "xsd": "http://www.w3.org/2001/XMLSchema#"
                },
                "name": "The Empire State Building",
                "description": "The Empire State Building is a 102-story landmark in New York City.",
                "image": "http://www.civil.usherbrooke.ca/cours/gci215a/empire-state-building.jpg",
                "geo": {
                    "latitude": "40.75",
                    "longitude": "73.98"
                }
            };

            _txt = doc;

            jsonLdPro.toRDF(_txt).then(function (dataset) {
                console.log("start affect");
                var resultArr = dataset["@default"];
                //var g = graph();

                console.log("end affect");

                resultArr.forEach(function (triple) {
                    graph.graph.addTriple(iri(triple.subject.value),
                        iri(triple.predicate.value), triple.object);
                });
                if (graph) {
                    console.log("res");
                    resolve(graph);
                } else {
                    console.log("reject");
                    reject(graph);
                }
            }, function (err) {
                console.log("err");
                console.log(err);
            });
        });
    };
};

exports.Parser = Parser;

require('./factory.js').register({
    contentType: 'application/debug+json',
    parserMaker: Parser
});
