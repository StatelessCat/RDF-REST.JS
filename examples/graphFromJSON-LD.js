"use strict";

var jsonld = require('../src/parsers/json-ld');

// we define a Json-LD document
var doc = {
    "@context": "http://json-ld.org/contexts/person.jsonld",
    "@id": "http://dbpedia.org/resource/John_Lennon",
    "name": "John Lennon",
    "born": "1940-10-09",
    "spouse": "http://dbpedia.org/resource/Cynthia_Lennon"
};

jsonld.toGraph(doc).then(function (graph) {
    graph.forEachTriple(null, null, null, console.log);
});