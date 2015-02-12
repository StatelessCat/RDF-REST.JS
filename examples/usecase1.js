// jshint node: true
/*eslint-env node*/

"use strict";

var graph = require("../src/graph.js").graph;
var getParser = require("../src/parsers/factory.js").getParser;

require("../src/parsers/json-ld-adapter"); // ensures that parser is registered

var parser = getParser({
    contentType: "application/ld+json",
    graph: graph()
});

var doc = {
    "@context": "http://json-ld.org/contexts/person.jsonld",
    "@id": "http://dbpedia.org/resource/John_Lennon",
    "name": "John Lennon",
    "born": "1940-10-09",
    "spouse": "http://dbpedia.org/resource/Cynthia_Lennon"
};

parser.addChunk(JSON.stringify(doc));

var aPromise = parser.finalize();

aPromise.then(function (graph) {
    graph.forEachTriple(null, null, null, console.log);
});
