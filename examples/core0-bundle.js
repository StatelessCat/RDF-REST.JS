/*eslint-env node*/

"use strict";

// This example show that we can use the CommonJS interface
//  produced by browserify on the rdfrestjs lib

// loading the lib via the CommonJS interface of the browserified bundle:
var rdfrestjs = require("../browserified/rdfrest-bundle");

// inform the Core factory of a ressource
var BasicCore = rdfrestjs.coreBasic.BasicCore;
var graph = rdfrestjs.graph.graph;
var makeIri = rdfrestjs.rdfNode.iri;
rdfrestjs.coreFactory.register("http://ex.co", function(uri) {
    var g = graph();
    g.addTriple(makeIri(uri),
        makeIri("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        makeIri("http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource")
    );
    g.addTriple(makeIri(uri),
        makeIri("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        makeIri("http://schema.org/Person")
    );
    return new BasicCore(uri, g);
});

// Get the corresponding Core
var getCore = rdfrestjs.coreFactory.getCore;
var iri = rdfrestjs.rdfNode.iri;
var namespace = rdfrestjs.rdfNode.namespace;
var nt = rdfrestjs.serializerNTriples.nt;

var john = iri("http://ex.co/JohnLennon");
var ns = namespace("http://schema.org/");
var bc = getCore(john);

bc.getState().then(function(g) {
    return nt(g, console.log);
}).then(function() {
    return bc.edit(function(g) {
        return g.addTriple(john, ns("name"), "John Lennon");
    });
}).then(function(g) {
    console.log("----\n");
    return nt(g, console.log);
});
