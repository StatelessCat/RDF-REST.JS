// jshint node: true

var Promise = require('promise');
var copyGraph = require('../graph.js').copyGraph;
var readonlyWrapper = require('../graph.js').readonlyWrapper;

var MAX_AGE_REGEX = /max-age=([0-9]+)/;

var BasicCore = function(iri, graph) {
    if (!(this instanceof BasicCore)) return new BasicCore(iri, graph);

    var that = this;

    that.iri = iri;
    that._graph = graph;

    that.getState = function(forceRefresh) {
        /** 
            Promises an RDF graph representing the current state of the core.
            
            Unless forceRefresh is true, that graph could be a cached version.

            stability: 3
        */
        return Promise.resolve(readonlyWrapper(graph));
    };

    that.edit = function(editor) {
        /**
           Promises to apply function 'editor' to the current state of the core,
           and to return the resulting state.
           
           stability: 3
        */
        return Promise.resolve(editor(graph))
            .then(function() {
                return graph;
            });
    };

    that.postGraph = function(graph) {
        /**
           Promises to process the posted graph.
           
           Not implemented in BasicCore.
           
           stability: 3
        */
        return Promise.reject("can't post graph to BasicCore");
    };

    that.delete = function() {
        /**
           Promises to delete this core.
           
           Not implemented in BasicCore.
           
           stability: 3
        */
        return Promise.reject("can't delete BasicCore");
    };

    Object.freeze(that);
};

exports.BasicCore = BasicCore;

