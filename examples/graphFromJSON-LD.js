"use strict";

var Parser = require('../src/parsers/json-ld-adapter').Parser;
var graph = require('../src/graph').graph;

// we define a Json-LD document
var doc = {
    "@context": {
        "name": "http://schema.org/name",
        "description": "http://schema.org/description",
        "image": {
            "@id": "http://schema.org/image",
            "@type": "@id"
        },
        "geo": "http://schema.org/geo",
        "latitude": {
            "@id": "http://schema.org/latitude",
            "@type": "xsd:float"
        },
        "longitude": {
            "@id": "http://schema.org/longitude",
            "@type": "xsd:float"
        },
        "xsd": "http://www.w3.org/2001/XMLSchema#"
    },
    "name": "The Empire State Building",
    "description": "The Empire State Building is a 102-story landmark in New York City.",
    "image": "http://www.civil.usherbrooke.ca/cours/gci215a/empire-state-building.jpg",
    "geo": {
        "latitude": "40.75",
        "longitude": "73.98"
    }
};

var p = new Parser({
    contentType:'application/debug+json',
    graph: graph()
});

p.addChunk(doc);

var aPromise = p.finalize();

aPromise.then(function (parsedGraph) {
    console.log("ok");
    parsedGraph.graph.forEachTriple(null, null, null, console.log);
}, function (err) {
    console.log("err");
    console.log(err);
});

//console.log(p);


//
//});