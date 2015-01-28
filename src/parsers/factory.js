// jshint node: true

var _REGISTRY = {};

exports.register = function(args) {
    "use strict";
    _REGISTRY[args.contentType] = args.parserMaker;
};

exports.getParser = function(args) {
    "use strict";
    var parserMaker = _REGISTRY[args.contentType];
    return parserMaker(args.graph);
};

// TODO add other parameters to registry:
// - domain name
// - rdf type
// - priority
