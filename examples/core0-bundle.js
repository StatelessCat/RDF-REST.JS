/*eslint-env node*/

"use strict";

// This example show that we can use the CommonJS interface
//  produced by browserify on the rdfrestjs lib

// loading the lib via the CommonJS interface of the browserified bundle:
var rdfrestjs = require("../browserified/rdfrest-bundle");

var getCore = rdfrestjs.coreFactory.getCore;
var iri = rdfrestjs.rdfNode.iri;
var namespace = rdfrestjs.rdfNode.namespace;
var nt = rdfrestjs.serializerNTriples.nt;

var me = iri("http://champin.net/#pa");
var ns = namespace("http://ex.co/vocab#");
var bc = getCore(me);

bc.getState().then(function(g) {
    return nt(g, console.log);
}).then(function() {
    return bc.edit(function(g) {
        return g.addTriple(me, ns("type"), ns("Person"))
            .then(function() {
                bc.edit(function(g2) {
                    return g2.addTriple(me, ns("label"), "Pierre-Antoine Champin");
                });
            });
    });
}).then(function(g) {
    console.log("----\n");
    return nt(g, console.log);
}).then(function() {
    console.log("---- \n");
    return bc.getState();
}).then(function(g) {
    return nt(g, console.log);
}).done();
