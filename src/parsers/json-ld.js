"use strict";

var jsonld = require('jsonld');
var ntriples = require('./n-triples');

var promises = jsonld.promises; // use the promises API of jsonld

/**
 * Returns a Promise that is able to serve a graph representation
 * @param
 */
exports.toGraph = function (jsonld) {
    return promises.toRDF(jsonld, {format: 'application/nquads'})
        .then(function (nquads) {
            console.log(nquads);
            // we have all nquad inside a string, we can get the graph
            var g = ntriples.toGraph(nquads);
            return g;
        });
};