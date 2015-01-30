// jshint node: true

var _REGISTRY = {};

exports.register = function(args) {
    _REGISTRY[args.contentType] = args.serializer;
};

exports.getSerializer = function(args) {
    var serializer = _REGISTRY[args.contentType];
    if (!serializer) {
        throw "Could not find serializer for " + JSON.stringify(args);
    }
    return function(callback) {
        return serializer(args.graph, callback);
    };
};

// TODO add other parameters to registry:
// - domain name
// - rdf type
// - priority
