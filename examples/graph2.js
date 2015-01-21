// jshint node: true

var graph = require('../src/graph.js').graph;
var bnode = require('../src/rdfnode.js').bnode;
var canonicalize = require('../src/rdfnode.js').canonicalize;
var iri = require('../src/rdfnode.js').iri;
var langstring = require('../src/rdfnode.js').langstring;
var namespace = require('../src/rdfnode.js').namespace;
var getSerializer = require('../src/serializers/factory.js').getSerializer;
var getParser = require('../src/parsers/factory.js').getParser;

require('../src/parsers/debug.js'); // ensures that parser is registered
require('../src/serializers/jsonld.js'); // ensures that serializer is registered
require('../src/serializers/nt.js'); // ensures that serializer is registered

/******** populate graph ********/

var me = iri('http://champin.net/#pa');
var ns = namespace('http://ex.co/vocab#');
var g = graph();
g.addTriple(me, ns('type'), ns('Person'));
g.addTriple(me, ns('label'), "Pierre-Antoine Champin"); 

/******** serialize graph as debug+json, parse it back, and serialize it to NT ********/

var p = getParser({
    contentType:'application/debug+json',
    graph: graph()
});
var serializeToJson = getSerializer({
    contentType:'application/debug+json',
    graph: g
});

serializeToJson(function(line){ p.addChunk(line); })
    .then(function() {
        return p.finalize();
    }).then(function(parsedGraph) {
        var serializeToNT = getSerializer({
            contentType: 'application/n-triples',
            graph: parsedGraph
        });
        return serializeToNT(function(line) { console.log(line); });
    }).done();

