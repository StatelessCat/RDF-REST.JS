// jshint node: true

var getCore = require('../src/cores/factory.js').getCore;
var graph = require('../src/graph.js').graph;
var iri = require('../src/rdfnode.js').iri;
var namespace = require('../src/rdfnode.js').namespace;
var nt = require('../src/serializers/nt.js').nt;

require('../src/parsers/debug.js'); // ensures that parser is registered
require('../src/serializers/jsonld.js'); // ensures that serializer is registered


var me = iri('http://champin.net/#pa');
var ns = namespace('http://ex.co/vocab#');

var resource = getCore('http://localhost:12345/');

resource.getState().then(function(g) {
    return nt(g, console.log);
}).then(function() {
    return resource.edit(function(g) {
        return g.addTriple(me, ns('type'), ns('Person'))
            .then(function() {
                resource.edit(function(g2) {
                    return g2.addTriple(me, ns('label'), "Pierre-Antoine Champin");
                });
            });
    });
}).then(function(g) {
    console.log('----\n');
    return nt(g, console.log);
}).then(function() {
    console.log('---- \n');
    return resource.getState();
}).then(function(g) {
    return nt(g, console.log);
}).done();
