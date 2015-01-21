// jshint node: true

var namespace = require('../rdfnode.js').namespace;

var HYDRA = namespace('http://www.w3.org/ns/hydra/core#');

var HydraCore = function(core, hydraspec, restcontext) {
    /**
       A Core implementing a given Hydra specification.

       core: the underlying core object (actually implementing the operations)
       hydraspec: an RDF graph containing the Hydra specification
       restcontext: an object describing the REST context of this resource
           (useful to locate which part(s) of the Hydra specification apply to it)

       stability: 1
     */

    that.getState = function(forceRefresh) {
        /** 
            Promises an RDF graph representing the current state of the core.
            
            Unless forceRefresh is true, that graph could be a cached version.

            stability: 3
        */
        // TODO, among other things:
        // - check that GET is supported
        // - remove write-only properties if any
    };

    that.edit = function(editor) {
        /**
           Promises to apply function 'editor' to the current state of the core,
           and to return the resulting state.
           
           stability: 3
        */
        // TODO, among other things:
        // - check if PUT is supported
        // - check that the edited graph does not violates any constraint
    };

    that.postGraph = function(graph) {
        /**
           Promises to process the posted graph.
           
           Not implemented in BasicCore.
           
           stability: 3
        */
        // TODO, among other things:
        // - check if POST is supported
        // - check that the posted graph does not violates any constraint
    };

    that.delete = function() {
        /**
           Promises to delete this core.
           
           Not implemented in BasicCore.
           
           stability: 3
        */
        // TODO, among other things:
        // - check if DELETE is supported
    };

    Object.freeze(that);
};
