"use strict";

var N3 = require('n3');
var Promise = require('promise'); //TODO check why the jslinter don't like
var graph = require('../graph.js').graph;
var iri = require('../rdfnode.js').iri;

/**
 * Returns a Promise that is able to serve a graph representation //TODO fixme!
 * @param ntriples
 */
exports.toGraph = function (ntriples) {
    var a_promise = new Promise(function (resolve, reject) {
        var parser = N3.Parser(),
            g = graph();

        // il faut une promise ici et attendre sa réalisation avant de lancer
        // le resolve !!!
        parser.parse(ntriples, function (error, triple, prefixes) {
            if (triple) {
                g.addTriple(iri(triple.subject),
                    iri(triple.predicate), triple.object); // on ajoute un à un les triplets
            }
            if (error) {
                console.log(error);
            }
        });


        if (g) {
            console.log("resolve va etre executé");
            resolve(g);
        } else {
            console.log("reject va etre executé");
            reject(new Error("It broke"));
        }
    });
    console.log("inside");
    return a_promise;
};

