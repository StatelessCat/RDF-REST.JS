/*eslint-env AMD*/

/*eslint-disable */
if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}
/*eslint-enable */

define(function (require, exports) {
    "use strict";

    var _REGISTRY = {};

    exports.register = function (args) {
        _REGISTRY[args.contentType] = args.parserMaker;
    };

    exports.getParser = function (args) {
        var parserMaker = _REGISTRY[args.contentType];
        if (!parserMaker) {
            throw "Could not find parser for " + JSON.stringify(args);
        }
        return parserMaker(args.graph);
    };

    // TODO add other parameters to registry:
    // - domain name
    // - rdf type
    // - priority
});
