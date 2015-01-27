"use strict";

var jsonld = require('jsonld');
var Promise = require('promise');
var graph = require('../graph.js').graph;
var iri = require('../rdfnode.js').iri;

/**
 * Returns a Promise that is able to serve a graph representation
 * @param
 */
exports.toGraph = function (jsonLd) {
    return new Promise(function (resolve, reject) {
        var jsonLdPro = new jsonld.JsonLdProcessor();

        jsonLdPro.toRDF(jsonLd).then(function (dataset) {
            var resultArr = dataset["@default"],
                g = graph();

            resultArr.forEach(function (triple) {
                g.addTriple(iri(triple.subject.value), iri(triple.predicate.value), triple.object);
            });
            if (g) {
                resolve(g);
            } else {
                reject(g);
            }
        });
    });
};
