/*eslint-env node*/

// This example need http Core
// We comment the two lines that register the Http Core for ensure browser compat
// We can still use this example, just uncomment the last two lines of factory.js,
//   but it will break the browser compat
// TODO, we need to figure a rule to do browserification of the lib without the HTTP Core (it make sense)

"use strict";

var getCore = require("../src/cores/factory.js").getCore;
var iri = require("../src/rdfnode.js").iri;
var namespace = require("../src/rdfnode.js").namespace;
var nt = require("../src/serializers/nt.js").nt;

require("../src/parsers/json-ld-adapter"); // ensures that parser is registered
require("../src/serializers/jsonld.js"); // ensures that serializer is registered

var me = iri("http://champin.net/#pa");
var ns = namespace("http://ex.co/vocab#");

var resource = getCore("http://localhost:12345/");

resource.getState().then(function(g) {
    return nt(g, console.log);
}).then(function() {
    return resource.edit(function(g) {
        return g.addTriple(me, ns("type"), ns("Person"))
            .then(function() {
                resource.edit(function(g2) {
                    return g2.addTriple(me, ns("label"), "Pierre-Antoine Champin");
                });
            });
    });
}).then(function(g) {
    console.log("----\n");
    return nt(g, console.log);
}).then(function() {
    console.log("---- \n");
    return resource.getState();
}).then(function(g) {
    return nt(g, console.log);
}).done();
