"use strict";

var fs = require('fs');
var graph = require('../src/graph.js').graph;
var ntriples = require('../src/parsers/n-triples-adapter');

var pachampinttl = "pchampin-index.ttl";
var rdfStream = fs.createReadStream(pachampinttl);

ntriples.toGraph(rdfStream).then(function (graph) {
    graph.forEachTriple(null, null, null, console.log);
});
