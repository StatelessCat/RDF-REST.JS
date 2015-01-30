Welcome to simple-rdf.
# Overview
simple-rdf is a simple in-memory RDF store for JS.

# Use case 1 - [Look the source code](https://github.com/StatelessCat/simple-rdf.js/blob/master/examples/usecase1.js)
You want to create an in-memory RDF Graph Representation from a Json-LD document.

Requiring the parser:
```js
var graph = require('../src/graph.js').graph;
var getParser = require('../src/parsers/factory.js').getParser;
require('../src/parsers/json-ld-adapter'); // ensures that parser is registered
```

Getting the ld+json parser from the Parser Factory and give to it an empty graph:
```js
var parser = getParser({
    contentType:'application/ld+json',
    graph: graph()
});
```

Defining the Json-LD document:
```js
var doc = {
    "@context": "http://json-ld.org/contexts/person.jsonld",
    "@id": "http://dbpedia.org/resource/John_Lennon",
    "name": "John Lennon",
    "born": "1940-10-09",
    "spouse": "http://dbpedia.org/resource/Cynthia_Lennon"
};
```

Add a stringified version of the Json-LD document to the parser instance:
```js
p.addChunk(JSON.stringify(doc));
```

Defining a Promise that represent an asynchronous computation of an in-memory RDF Graph Representation from the Json-LD document:
```js
var aPromise = parser.finalize();
```

Fullfill the Promise to perform the parsing, and show each triples of the RDF Graph:
```js
aPromise.then(function (graph) {
    graph.forEachTriple(null, null, null, console.log);
});
```

# Use case 2
You want a Json-LD document from a RDF Graph Representation
TODO

