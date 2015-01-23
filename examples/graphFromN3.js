"use strict";

var N3 = require('n3');
var fs = require('fs');
var Promise = require('promise');
var graph = require('../src/graph.js').graph;
var iri = require('../src/rdfnode.js').iri;
var ntriples = require('../src/parsers/n-triples');


var pachampinttl = "pchampin-index.ttl";
var rdfStream = fs.createReadStream(pachampinttl);
var parser = N3.Parser();
var g = graph();

ntriples.toGraph(rdfStream).then(function (graph) {
    console.log(graph);
    graph.forEachTriple(null, null, null, console.log);
});
