// jshint node: true

var _REGISTRY = [];

exports.register = function(iriPrefix, subfactory) {
    /**
       Informs getCore to use subfactory to produce all cores starting with iriPrefix

       stability: 2
    */

    // TODO sort prefixes in increasing size order
    // (to ensure priorities)
    _REGISTRY.push({
        iriPrefix: iriPrefix,
        subfactory: subfactory
    });
};

// TODO unregister

exports.getCore = function(iri) {
    /**
       Return the appropriate Core for resource identified by iri

       stability: 3
    */

    if (typeof iri === 'object') iri = iri['@id'];
    var ret;
    _REGISTRY.some(function(candidate) {
        if(iri.split(candidate.iriPrefix, 1)[0] === '') {
            ret = candidate.subfactory(iri);
            return true;
        }
    });
    return ret;
};

// TODO remove this; this is for debug only
var BasicCore = require('./basic.js').BasicCore;
var graph = require('../graph.js').graph;
var makeIri = require('../rdfnode.js').iri;
exports.register("http://", function(iri) {
    var g = graph();
    g.addTriple(makeIri(iri),
                makeIri('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
                makeIri('http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource')
               );
    return new BasicCore(iri, g);
});
