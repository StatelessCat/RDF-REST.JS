"use strict";
var jsonld = require('jsonld');
var N3 = require('n3');

// use the promises API of jsonld
var promises = jsonld.promises;

// we define a Json-LD document
var doc = {
    "@context": "http://json-ld.org/contexts/person.jsonld",
    "@id": "http://dbpedia.org/resource/John_Lennon",
    "name": "John Lennon",
    "born": "1940-10-09",
    "spouse": "http://dbpedia.org/resource/Cynthia_Lennon"
};

// serialize to RDF
var promise = promises.toRDF(doc, {format: 'application/nquads'});
promise.then(function (nquads) {
    console.log(nquads);


}, function (err) {
    console.log(err);
});

