/*eslint-env node*/

var coreFactory = require("./cores/factory");
var coreBasic = require("./cores/basic");
// var coreHttp = require("./cores/http");
var coreHydra = require("./cores/hydra");

var parserFactory = require("./parsers/factory");
var parserDebug = require("./parsers/debug");
var parserJsonLdAdapter = require("./parsers/json-ld-adapter");
var parserNTriplesAdapter = require("./parsers/n-triples-adapter");

var serializerFactory = require("./serializers/factory");
var serializerJsonLd = require("./serializers/jsonld");
var serializerNTriples = require("./serializers/nt");

var graph = require("./graph");
var rdfNode = require("./rdfnode");

module.exports = {
    coreFactory: coreFactory,
    coreBasic: coreBasic,
    //coreHttp: coreHttp,
    coreHydra: coreHydra,

    parserFactory: parserFactory,
    parserDebug: parserDebug,
    parserJsonLdAdapter: parserJsonLdAdapter,
    parserNTriplesAdapter: parserNTriplesAdapter,

    serializerFactory: serializerFactory,
    serializerJsonLd: serializerJsonLd,
    serializerNTriples: serializerNTriples,

    graph: graph,
    rdfNode: rdfNode
};
