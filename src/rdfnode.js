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

    var assert = require("assert");

    var RDF_LANGSTRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString";
    var XSD_BOOLEAN = "http://www.w3.org/2001/XMLSchema#boolean";
    var XSD_DOUBLE = "http://www.w3.org/2001/XMLSchema#double";
    var XSD_INTEGER = "http://www.w3.org/2001/XMLSchema#integer";
    var XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";

    exports.iri = function (iristr) {
        return {"@id": iristr};
    };
    var iri = exports.iri;

    exports.namespace = function (iristr) {
        if (typeof iristr === "object") { // also accept iri nodes
            iristr = iri["@id"];
        }
        return function (suffix) {
            return iri(iristr + suffix);
        };
    };

    exports.bnode = function (bnodeid) {
        if (bnodeid === undefined) {
            // TODO coin a fresh bnodeid
            throw "not implemented yet";
        }
        return {"@id": "_:" + bnodeid};
    };

    exports.langstring = function (value, language) {
        return {
            "@value": value,
            "@language": language,
            "@type": RDF_LANGSTRING
        };
    };

    exports.canonicalize = function (n) {
        var typeofn = typeof n;
        if (typeofn === "object") {
            // optimistic optimization: we do not check for @id or @value
            return n;
            // TODO should we be more strict ?
        } else if (typeofn === "string") {
            return {"@value": n, "@type": XSD_STRING};
        } else if (typeofn === "boolean") {
            return {"@value": String(n), "@type": XSD_BOOLEAN};
        } else if (typeofn === "number") {
            throw "TODO: implement int vs. float distinction";
        } else {
            throw "unrecognized node";
        }
        // TODO for strings (if typeofn is object or string),
        // should we still include @type xsd:string?
    };

    exports.toNT = function (n) {
        assert(typeof n === "object"); // should be canonicalized
        var id = n["@id"];
        var ret;
        if (id !== undefined) {
            id = n["@id"];
            if (id[0] === "_") {
                ret = id;
            } else {
                ret = "<" + id + ">";
            }
        } else {
            var value = n["@value"];
            assert(value !== undefined);
            // TODO JSON escaping may not be strictly equivalent to NT escaping
            ret = JSON.stringify(value);
            var datatype = n["@type"];
            if (datatype === XSD_STRING) {
                // LEAVE DATATYPE IMPLICIT
            } else if (datatype === RDF_LANGSTRING) {
                var language = n["@language"];
                if (language !== undefined) {
                    ret += "@" + language;
                }
            } else {
                ret += "^^<" + datatype + ">";
            }
        }
        return ret;
    };

    exports.sameNode = function (n1, n2) {
        assert(typeof n1 === "object"); // must be in canonical form
        assert(typeof n2 === "object"); // must be in canonical form
        return (
        n1["@id"] === n2["@id"] &&
        n1["@value"] === n2["@value"] &&
        n1["@type"] === n2["@type"] &&
        n1["@language"] === n2["@language"]
        );
    };
});
