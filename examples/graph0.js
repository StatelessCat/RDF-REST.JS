// jshint node: true

var Promise = require('promise');

var graph = require('../src/graph.js').graph;
var bnode = require('../src/rdfnode.js').bnode;
var canonicalize = require('../src/rdfnode.js').canonicalize;
var iri = require('../src/rdfnode.js').iri;
var langstring = require('../src/rdfnode.js').langstring;
var namespace = require('../src/rdfnode.js').namespace;

// ******** Nodes ********

// creating an IRI
var me = iri('http://champin.net/#pa');

// creating IRIs using a Namespace
var ns = namespace('http://ex.co/vocab#');
var type = ns('type'); // <-> iri('http://ex.co/vocab#type')
var label = ns('label'); // <-> iri('http://ex.co/vocab#label')
var Person = ns('Person'); //<-> // iri('http://ex.co/vocab#Person')

// creating a bnode
var anonymous = bnode('xyz123'); // xyz123 is the bnode identifier
//var anonymous = bnode(); // NOT SUPPORTED YET

// creating a literal
// canonical form
var pi = {
    '@value': "3.141592653589793",
    '@type': "http://www.w3.org/2001/XMLSchema#double"
};
// language string
var labelP = langstring("Personne", "fr"); // has @value, @language and @type
// JS datatypes to literals
var name = canonicalize("Pierre-Antoine Champin");
// var answer = canonicalize(42); // NOT SUPPORTED YET

// ******** Graph ********

var g = graph();
var prom = Promise.all([
    g.addTriple(me, type, Person),
    g.addTriple(me, label, name),
     g.addTriple(Person, label, labelP),

     // nb the 3rd argument of addTriple is automatically canonicalized,
     // so the following is also possible
     g.addTriple(me, label, "pchampin"),
 ]);


// ******** Serialize ********

 prom = prom
    .then(function() {
        var nt = require('../src/serializers/nt.js').nt;
        return nt(g, function(line) { console.log(line); });
    })
    .then(function() {
        console.log('\n\n');
        var jsonld = require('../src/serializers/jsonld.js').jsonld;
        return jsonld(g, function(line) { console.log(line); });
    })
    .done();

