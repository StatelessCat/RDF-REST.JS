var N3 = require('n3');
var fs = require('fs');
var Promise = require('promise');

var graph = require('../src/graph.js').graph;
var bnode = require('../src/rdfnode.js').bnode;
var canonicalize = require('../src/rdfnode.js').canonicalize;
var iri = require('../src/rdfnode.js').iri;
var langstring = require('../src/rdfnode.js').langstring;
var namespace = require('../src/rdfnode.js').namespace;

// creating IRIs using a Namespace
var ns = namespace('http://ex.co/vocab#');

var pachampinttl = "pchampin-index.ttl";

//function readFile(filename, enc){
//    return new Promise(function (fulfill, reject){
//        fs.readFile(filename, enc, function (err, res){
//            if (err) reject(err);
//            else fulfill(res);
//        });
//    });
//};
//
//var ttl = readFile(pachampinttl, {encoding: 'utf-8'}).then(function (res){
//    return res;
//});

var rdfStream = fs.createReadStream(pachampinttl);
var parser = N3.Parser();
var g = graph();

parser.parse(rdfStream, function (error, triple, prefixes) {
    if (triple)
        g.addTriple(iri(triple.subject), iri(triple.predicate), triple.object); // on ajoute un à un les triplets
    else
        console.log("# That's all, folks!", prefixes)
});

console.log(g)