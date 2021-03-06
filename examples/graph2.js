// jshint node: true
/*eslint-env node*/

"use strict";

var graph = require("../src/graph.js").graph;
var iri = require("../src/rdfnode.js").iri;
var namespace = require("../src/rdfnode.js").namespace;
var getSerializer = require("../src/serializers/factory.js").getSerializer;
var getParser = require("../src/parsers/factory.js").getParser;

require("../src/parsers/json-ld-adapter"); // ensures that parser is registered
require("../src/serializers/jsonld.js"); // ensures that serializer is registered
require("../src/serializers/nt.js"); // ensures that serializer is registered

/******** populate graph ********/

var me = iri("http://champin.net/#pa");
var ns = namespace("http://ex.co/vocab#");
var g = graph();
g.addTriple(me, ns("type"), ns("Person"));
g.addTriple(me, ns("label"), "Pierre-Antoine Champin");

/***** serialize graph as ld+json, parse it back, and serialize it to NT *****/

var p = getParser({
    contentType: "application/ld+json",
    graph: graph()
});
var serializeToJson = getSerializer({
    contentType: "application/debug+json",
    graph: g
});

serializeToJson(function(line){
    p.addChunk(line);
})
    .then(function() {
        return p.finalize();
    })
    .then(function(parsedGraph) {
        var serializeToNT = getSerializer({
            contentType: "application/n-triples",
            graph: parsedGraph
        });
        parsedGraph.forEachTriple(null, null, null, console.log);
        return serializeToNT(function(line) {
            console.log(line); });
    }).done();
