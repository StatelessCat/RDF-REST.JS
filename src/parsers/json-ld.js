"use strict";

var jsonld = require('jsonld');
var ntriples = require('./n-triples');
var Promise = require('promise'); //TODO check why the jslinter don't like

// use the promises API of jsonld
var promises = jsonld.promises;

/**
 * Returns a Promise that is able to serve a graph representation
 * @param ntriples
 */
exports.toGraph = function (jsonld) {
    return new Promise(function (resolve) {
        // serialize to RDF
        var promise = promises.toRDF(jsonld, {format: 'application/nquads'});

        promise.then(function (nquads) {
            console.log(nquads);
            // we have all nquad inside a string, we can get the graph
            var g = ntriples.toGraph(nquads);
            resolve(g);
        }, function (err) {
            console.log(err);
        });
    });
};