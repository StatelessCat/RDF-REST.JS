/*eslint-env node*/
/*eslint-disable no-underscore-dangle */

"use strict";

var jsonld = require("jsonld");
//noinspection Eslint
var Promise = require("promise");
var iri = require("../rdfnode.js").iri;

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
                    if ( ((/string/).test(triple.object.datatype)) &&
                        ((/literal/).test(triple.object.type)) ) {
                        // TODO unsafe checking ?

                        // the object of the triple is a literal of type string,
                        // we use the automatic canonicalisation of graph.js:
                        graph.addTriple(
                            iri(triple.subject.value),
                            iri(triple.predicate.value),
                            triple.object.value);
                        // TODO explicitly using canonicalize ?

                    } else {
                        graph.addTriple(
                            iri(triple.subject.value),
                            iri(triple.predicate.value),
                            iri(triple.object.value));
                    } // TODO maybe a condition is missing here
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

require("./factory.js").register({
    contentType: "application/ld+json",
    parserMaker: Parser
});
