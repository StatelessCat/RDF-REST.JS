Welcome to rdf-rest-js.
# Overview
rdf-rest-js

Now a browserified version is available, it's browserified/rdfrest-bundle.js

# Using rdf-rest-js:

We are using browserify to bundle this lib and his dependencies into one rdfrest-bundle.js that expose both AMD and CommonJS.
Here is the command we uses for creating the bundle:

```bash
browserify src/rdf-rest-lib.js --standalone rdfrestjs > browserified/rdfrest-bundle.js
```

## Via AMD, for browsers, using bower to get the lib, and RequireJS to load it (or any AMD compliant loader)

```js
require.config({
    paths: {
        rdfrestjs: "bower_components/rdf-rest-js/browserified/rdfrest-bundle"
    }
});

define(["rdfrestjs"], function(rdfrestjs) {
    "use strict";

    // use rdfrestjs via his factories
    // the actual interface is in src/rdf-rest-lib.js

});


```

## Via CommonJs, for Node.js, using npm (Not yet available)

```
npm install rdf-rest-js
```

```js
Not yet available
```

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

