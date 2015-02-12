// jshint node: true
/*eslint-env node*/

"use strict";

var fs = require("fs");
var ntriples = require("../src/parsers/n-triples-adapter");

var pachampinttl = "pchampin-index.ttl";
var rdfStream = fs.createReadStream(pachampinttl);

ntriples.toGraph(rdfStream).then(function (graph) {
    graph.forEachTriple(null, null, null, console.log);
});
