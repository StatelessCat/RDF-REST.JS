// jshint node: true

var graph = require('../src/graph.js').graph;
var namespace = require('../src/rdfnode.js').namespace;

var ns = namespace('http://ex.co/');

var g = graph();

function displayP(prom) {
    // promise to displays the result of prom,
    // then to provide it
    return prom.then(function(data) {
        console.log(data);
        return data;
    });
}

function addTripleAndDisplayCount(g, s, p, o) {
    return g.addTriple(s, p, o)
        .then(function() {
            return g.countTriples();
        })
        .then(
            g.countTriples
        )
        .then(function(count) {
            console.log('%j triples', count);
        })
    ;
}

function throwErr(err) { console.error(err); throw err; }

g.countTriples()
    .then(function(count) {
        console.log('%j triples', count);
    }, throwErr)
    .then(function() {
        return addTripleAndDisplayCount(g, ns('s1'), ns('p'), ns('o1'));
    })
    .then(function() {
        return addTripleAndDisplayCount(g,ns('s1'), ns('p'), ns('o2'));
    })
    .then(function() {
        return addTripleAndDisplayCount(g,ns('s2'), ns('p'), ns('o1'));
    })
    .then(function() {
        return addTripleAndDisplayCount(g,ns('s3'), ns('q'), ns('o3'));
    })
    .then(function() {
        return addTripleAndDisplayCount(g,ns('s1'), ns('p'), "hello world");
    })


    .then(function() {
        return displayP(
            g.containsTriple(ns('s1'), ns('p'), ns('o1'))
        );
    })
    .then(function() {
        return displayP(
            g.containsTriple(ns('s1'), ns('q'), ns('o1'))
        );
    })

    .then(function() {
        var count = 0;
        var prom = g.forEachTriple(null, null, null, function(s, p, o) {
            console.log(s, p, o);
            count += 1;
        })
            .then(function() {
                console.log('printed %j triple(s)', count);
            });
        return prom;
    })
    .then(function() {
        var count = 0;
        var prom = g.forEachTriple(ns('s1'), null, null, function(s, p, o) {
            g.removeTriple(s, p, o);
            count += 1;
        })
            .then(function() {
                console.log('removed %j triple(s)', count);
            });
        return prom;
    })
    .then(function() {
        return displayP(
            g.countTriples()
        );
    })
    .then(function() {
        var count = 0;
        var prom = g.forEachTriple(null, null, null, function(s, p, o) {
            g.removeTriple(s, p, o);
            count += 1;
        })
            .then(function() {
                console.log('removed %j triples', count);
            });
        return prom;
    })
    .then(function() {
        return displayP(
            g.countTriples()
        );
    })
    .done();
