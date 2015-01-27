Welcome to simple-rdf.
# Overview
simple-rdf is a simple in-memory RDF store for JS.

# Examples
Requiring json-ld-adapter:
```js
var jsonld = require('json-ld-adapter');
```
```js
var doc = {
    "@context": "http://json-ld.org/contexts/person.jsonld",
    "@id": "http://dbpedia.org/resource/John_Lennon",
    "name": "John Lennon",
    "born": "1940-10-09",
    "spouse": "http://dbpedia.org/resource/Cynthia_Lennon"
};
```

Creating an in-memory RDF Graph Representation from a Json-LD document:
```js
jsonld.toGraph(doc).then(function (graph) {
    graph.forEachTriple(null, null, null, console.log);
});
```
