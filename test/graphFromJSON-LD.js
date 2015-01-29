"use strict";

var graph = require('../src/graph').graph;
var getParser = require('../src/parsers/factory.js').getParser;
require('../src/parsers/json-ld-adapter'); // ensures that parser is registered

var toGraph = function(jsonLdDocument, options) {
    var p = getParser({
        contentType:'application/ld+json',
        graph: graph()
    });

    p.addChunk(JSON.stringify(jsonLdDocument));

    var aPromise = p.finalize();
    require('../src/parsers/debug.js'); // ensures that parser is registered
    aPromise.then(function (parsedGraph) {
        console.log("ok");
        if (options.printGraph) {
            parsedGraph.forEachTriple(null, null, null, console.log);
        }
    }, function (err) {
        console.log("err");
        console.log(err);
    });
};

// ld+json documents

var jsonLdDoc1 = {
    "@context": "http://schema.org/",
    "@type": "Person",
    "name": "Jane Doe",
    "jobTitle": "Professor",
    "telephone": "(425) 123-4567",
    "url": "http://www.janedoe.com"
};

var jsonLdDoc2 = {
    "@context": {
        "ical": "http://www.w3.org/2002/12/cal/ical#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "ical:dtstart": {
            "@type": "xsd:dateTime"
        }
    },
    "ical:summary": "Lady Gaga Concert",
    "ical:location": "New Orleans Arena, New Orleans, Louisiana, USA",
    "ical:dtstart": "2011-04-09T20:00Z"
};

var jsonLdDoc3 = {
    "@context": {
        "name": "http://schema.org/name",
        "description": "http://schema.org/description",
        "image": {
            "@id": "http://schema.org/image",
            "@type": "@id"
        },
        "geo": "http://schema.org/geo",
        "latitude": {
            "@id": "http://schema.org/latitude",
            "@type": "xsd:float"
        },
        "longitude": {
            "@id": "http://schema.org/longitude",
            "@type": "xsd:float"
        },
        "xsd": "http://www.w3.org/2001/XMLSchema#"
    },
    "name": "The Empire State Building",
    "description": "The Empire State Building is a 102-story landmark in " +
    "New York City.",
    "image": "http://www.civil.usherbrooke.ca/cours/gci215a/empire-state-" +
    "building.jpg",
    "geo": {
        "latitude": "40.75",
        "longitude": "73.98"
    }
};

var jsonLdDoc4 = {
    "@context": {
        "gr": "http://purl.org/goodrelations/v1#",
        "pto": "http://www.productontology.org/id/",
        "foaf": "http://xmlns.com/foaf/0.1/",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "foaf:page": {
            "@type": "@id"
        },
        "gr:acceptedPaymentMethods": {
            "@type": "@id"
        },
        "gr:hasBusinessFunction": {
            "@type": "@id"
        },
        "gr:hasCurrencyValue": {
            "@type": "xsd:float"
        }
    },
    "@id": "http://example.org/cars/for-sale#tesla",
    "@type": "gr:Offering",
    "gr:name": "Used Tesla Roadster",
    "gr:description": "Need to sell fast and furiously",
    "gr:hasBusinessFunction": "gr:Sell",
    "gr:acceptedPaymentMethods": "gr:Cash",
    "gr:hasPriceSpecification": {
        "gr:hasCurrencyValue": "85000",
        "gr:hasCurrency": "USD"
    },
    "gr:includes": {
        "@type": [
            "gr:Individual",
            "pto:Vehicle"
        ],
        "gr:name": "Tesla Roadster",
        "foaf:page": "http://www.teslamotors.com/roadster"
    }
};

var jsonLdDoc5 = {
    "@context": {
        "name": "http://rdf.data-vocabulary.org/#name",
        "ingredient": "http://rdf.data-vocabulary.org/#ingredients",
        "yield": "http://rdf.data-vocabulary.org/#yield",
        "instructions": "http://rdf.data-vocabulary.org/#instructions",
        "step": {
            "@id": "http://rdf.data-vocabulary.org/#step",
            "@type": "xsd:integer"
        },
        "description": "http://rdf.data-vocabulary.org/#description",
        "xsd": "http://www.w3.org/2001/XMLSchema#"
    },
    "name": "Mojito",
    "ingredient": [
        "12 fresh mint leaves",
        "1/2 lime, juiced with pulp",
        "1 tablespoons white sugar",
        "1 cup ice cubes",
        "2 fluid ounces white rum",
        "1/2 cup club soda"
    ],
    "yield": "1 cocktail",
    "instructions": [
        {
            "step": 1,
            "description": "Crush lime juice, mint and sugar together in glass."
        },
        {
            "step": 2,
            "description": "Fill glass to top with ice cubes."
        },
        {
            "step": 3,
            "description": "Pour white rum over ice."
        },
        {
            "step": 4,
            "description": "Fill the rest of glass with club soda, stir."
        },
        {
            "step": 5,
            "description": "Garnish with a lime wedge."
        }
    ]
};

var jsonLdDoc6 = {
    "@context": {
        "dc": "http://purl.org/dc/elements/1.1/",
        "ex": "http://example.org/vocab#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "ex:contains": {
            "@type": "@id"
        }
    },
    "@graph": [
        {
            "@id": "http://example.org/library",
            "@type": "ex:Library",
            "ex:contains": "http://example.org/library/the-republic"
        },
        {
            "@id": "http://example.org/library/the-republic",
            "@type": "ex:Book",
            "dc:creator": "Plato",
            "dc:title": "The Republic",
            "ex:contains": "http://example.org/library/" +
                "the-republic#introduction"
        },
        {
            "@id": "http://example.org/library/the-republic#introduction",
            "@type": "ex:Chapter",
            "dc:description": "An introductory chapter on The Republic.",
            "dc:title": "The Introduction"
        }
    ]
};


var jsonLdDoc7 = {
    "@context": "http://asjsonld.mybluemix.net",
    "@type": "Post",
    "actor": {
        "@type": "Person",
        "@id": "acct:sally@example.org",
        "displayName": "Sally"
    },
    "object": {
        "@type": "Note",
        "content": "This is a simple note"
    },
    "published": "2015-01-25T12:34:56Z"
};

// ld+json expanded documents

var jsonLdExpandedDoc1 = [
    {
        "@type": [
            "http://schema.org/Person"
        ],
        "http://schema.org/jobTitle": [
            {
                "@value": "Professor"
            }
        ],
        "http://schema.org/name": [
            {
                "@value": "Jane Doe"
            }
        ],
        "http://schema.org/telephone": [
            {
                "@value": "(425) 123-4567"
            }
        ],
        "http://schema.org/url": [
            {
                "@id": "http://www.janedoe.com"
            }
        ]
    }
];

var jsonLdExpandedDoc2 = [
    {
        "http://www.w3.org/2002/12/cal/ical#dtstart": [
            {
                "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
                "@value": "2011-04-09T20:00Z"
            }
        ],
        "http://www.w3.org/2002/12/cal/ical#location": [
            {
                "@value": "New Orleans Arena, New Orleans, Louisiana, USA"
            }
        ],
        "http://www.w3.org/2002/12/cal/ical#summary": [
            {
                "@value": "Lady Gaga Concert"
            }
        ]
    }
];

var jsonLdExpandedDoc3 = [
    {
        "http://schema.org/description": [
            {
                "@value": "The Empire State Building is a 102-story landmark " +
                    "in New York City."
            }
        ],
        "http://schema.org/geo": [
            {
                "http://schema.org/latitude": [
                    {
                        "@type": "http://www.w3.org/2001/XMLSchema#float",
                        "@value": "40.75"
                    }
                ],
                "http://schema.org/longitude": [
                    {
                        "@type": "http://www.w3.org/2001/XMLSchema#float",
                        "@value": "73.98"
                    }
                ]
            }
        ],
        "http://schema.org/image": [
            {
                "@id": "http://www.civil.usherbrooke.ca/cours/gci215a/" +
                    "empire-state-building.jpg"
            }
        ],
        "http://schema.org/name": [
            {
                "@value": "The Empire State Building"
            }
        ]
    }
];

var jsonLdExpandedDoc4 = [
        {
            "@id": "http://example.org/cars/for-sale#tesla",
            "@type": [
                "http://purl.org/goodrelations/v1#Offering"
            ],
            "http://purl.org/goodrelations/v1#acceptedPaymentMethods": [
                {
                    "@id": "http://purl.org/goodrelations/v1#Cash"
                }
            ],
            "http://purl.org/goodrelations/v1#description": [
                {
                    "@value": "Need to sell fast and furiously"
                }
            ],
            "http://purl.org/goodrelations/v1#hasBusinessFunction": [
                {
                    "@id": "http://purl.org/goodrelations/v1#Sell"
                }
            ],
            "http://purl.org/goodrelations/v1#hasPriceSpecification": [
                {
                    "http://purl.org/goodrelations/v1#hasCurrency": [
                        {
                            "@value": "USD"
                        }
                    ],
                    "http://purl.org/goodrelations/v1#hasCurrencyValue": [
                        {
                            "@type": "http://www.w3.org/2001/XMLSchema#float",
                            "@value": "85000"
                        }
                    ]
                }
            ],
            "http://purl.org/goodrelations/v1#includes": [
                {
                    "@type": [
                        "http://purl.org/goodrelations/v1#Individual",
                        "http://www.productontology.org/id/Vehicle"
                    ],
                    "http://xmlns.com/foaf/0.1/page": [
                        {
                            "@id": "http://www.teslamotors.com/roadster"
                        }
                    ],
                    "http://purl.org/goodrelations/v1#name": [
                        {
                            "@value": "Tesla Roadster"
                        }
                    ]
                }
            ],
            "http://purl.org/goodrelations/v1#name": [
                {
                    "@value": "Used Tesla Roadster"
                }
            ]
        }
    ];

var jsonLdExpandedDoc5 = [
        {
            "http://rdf.data-vocabulary.org/#ingredients": [
                {
                    "@value": "12 fresh mint leaves"
                },
                {
                    "@value": "1/2 lime, juiced with pulp"
                },
                {
                    "@value": "1 tablespoons white sugar"
                },
                {
                    "@value": "1 cup ice cubes"
                },
                {
                    "@value": "2 fluid ounces white rum"
                },
                {
                    "@value": "1/2 cup club soda"
                }
            ],
            "http://rdf.data-vocabulary.org/#instructions": [
                {
                    "http://rdf.data-vocabulary.org/#description": [
                        {
                            "@value": "Crush lime juice, mint and sugar " +
                                "together in glass."
                        }
                    ],
                    "http://rdf.data-vocabulary.org/#step": [
                        {
                            "@type": "http://www.w3.org/2001/XMLSchema#integer",
                            "@value": 1
                        }
                    ]
                },
                {
                    "http://rdf.data-vocabulary.org/#description": [
                        {
                            "@value": "Fill glass to top with ice cubes."
                        }
                    ],
                    "http://rdf.data-vocabulary.org/#step": [
                        {
                            "@type": "http://www.w3.org/2001/XMLSchema#integer",
                            "@value": 2
                        }
                    ]
                },
                {
                    "http://rdf.data-vocabulary.org/#description": [
                        {
                            "@value": "Pour white rum over ice."
                        }
                    ],
                    "http://rdf.data-vocabulary.org/#step": [
                        {
                            "@type": "http://www.w3.org/2001/XMLSchema#integer",
                            "@value": 3
                        }
                    ]
                },
                {
                    "http://rdf.data-vocabulary.org/#description": [
                        {
                            "@value": "Fill the rest of glass with club soda," +
                                "stir."
                        }
                    ],
                    "http://rdf.data-vocabulary.org/#step": [
                        {
                            "@type": "http://www.w3.org/2001/XMLSchema#integer",
                            "@value": 4
                        }
                    ]
                },
                {
                    "http://rdf.data-vocabulary.org/#description": [
                        {
                            "@value": "Garnish with a lime wedge."
                        }
                    ],
                    "http://rdf.data-vocabulary.org/#step": [
                        {
                            "@type": "http://www.w3.org/2001/XMLSchema#integer",
                            "@value": 5
                        }
                    ]
                }
            ],
            "http://rdf.data-vocabulary.org/#name": [
                {
                    "@value": "Mojito"
                }
            ],
            "http://rdf.data-vocabulary.org/#yield": [
                {
                    "@value": "1 cocktail"
                }
            ]
        }
    ];

var jsonLdExpandedDoc6 = [
        {
            "@id": "http://example.org/library",
            "@type": [
                "http://example.org/vocab#Library"
            ],
            "http://example.org/vocab#contains": [
                {
                    "@id": "http://example.org/library/the-republic"
                }
            ]
        },
        {
            "@id": "http://example.org/library/the-republic",
            "@type": [
                "http://example.org/vocab#Book"
            ],
            "http://purl.org/dc/elements/1.1/creator": [
                {
                    "@value": "Plato"
                }
            ],
            "http://purl.org/dc/elements/1.1/title": [
                {
                    "@value": "The Republic"
                }
            ],
            "http://example.org/vocab#contains": [
                {
                    "@id": "http://example.org/library/" +
                        "the-republic#introduction"
                }
            ]
        },
        {
            "@id": "http://example.org/library/the-republic#introduction",
            "@type": [
                "http://example.org/vocab#Chapter"
            ],
            "http://purl.org/dc/elements/1.1/description": [
                {
                    "@value": "An introductory chapter on The Republic."
                }
            ],
            "http://purl.org/dc/elements/1.1/title": [
                {
                    "@value": "The Introduction"
                }
            ]
        }
    ];

var jsonLdExpandedDoc7 = [
        {
            "@type": [
                "http://www.w3.org/ns/activitystreams#Post"
            ],
            "http://www.w3.org/ns/activitystreams#actor": [
                {
                    "@id": "acct:sally@example.org",
                    "@type": [
                        "http://www.w3.org/ns/activitystreams#Person"
                    ],
                    "http://www.w3.org/ns/activitystreams#displayName": [
                        {
                            "@value": "Sally"
                        }
                    ]
                }
            ],
            "http://www.w3.org/ns/activitystreams#object": [
                {
                    "@type": [
                        "http://www.w3.org/ns/activitystreams#Note"
                    ],
                    "http://www.w3.org/ns/activitystreams#content": [
                        {
                            "@value": "This is a simple note"
                        }
                    ]
                }
            ],
            "http://www.w3.org/ns/activitystreams#published": [
                {
                    "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
                    "@value": "2015-01-25T12:34:56Z"
                }
            ]
        }
    ];

var jsonLdCompactedDoc1 = {
    "@context": "http://asjsonld.mybluemix.net",
    "@type": "http://schema.org/Person",
    "http://schema.org/jobTitle": "Professor",
    "http://schema.org/name": "Jane Doe",
    "http://schema.org/telephone": "(425) 123-4567",
    "http://schema.org/url": {
        "@id": "http://www.janedoe.com"
    }
};

var jsonLdCompactedDoc2 = {
    "@context": "http://schema.org/",
    "http://www.w3.org/2002/12/cal/ical#dtstart": {
        "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
        "@value": "2011-04-09T20:00Z"
    },
    "http://www.w3.org/2002/12/cal/ical#location": "New Orleans Arena, " +
        "New Orleans, Louisiana, USA",
    "http://www.w3.org/2002/12/cal/ical#summary": "Lady Gaga Concert"
};

var jsonLdCompactedDoc3 = {
    "@context": {
        "name": "http://schema.org/name",
        "description": "http://schema.org/description",
        "image": {
            "@id": "http://schema.org/image",
            "@type": "@id"
        },
        "geo": "http://schema.org/geo",
        "latitude": {
            "@id": "http://schema.org/latitude",
            "@type": "xsd:float"
        },
        "longitude": {
            "@id": "http://schema.org/longitude",
            "@type": "xsd:float"
        },
        "xsd": "http://www.w3.org/2001/XMLSchema#"
    },
    "description": "The Empire State Building is a 102-story landmark in " +
        "New York City.",
    "geo": {
        "latitude": "40.75",
        "longitude": "73.98"
    },
    "image": "http://www.civil.usherbrooke.ca/cours/gci215a/" +
        "empire-state-building.jpg",
    "name": "The Empire State Building"
};

var jsonLdCompactedDoc4 = {
    "@context": {
        "gr": "http://purl.org/goodrelations/v1#",
        "pto": "http://www.productontology.org/id/",
        "foaf": "http://xmlns.com/foaf/0.1/",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "foaf:page": {
            "@type": "@id"
        },
        "gr:acceptedPaymentMethods": {
            "@type": "@id"
        },
        "gr:hasBusinessFunction": {
            "@type": "@id"
        },
        "gr:hasCurrencyValue": {
            "@type": "xsd:float"
        }
    },
    "@id": "http://example.org/cars/for-sale#tesla",
    "@type": "gr:Offering",
    "gr:acceptedPaymentMethods": "gr:Cash",
    "gr:description": "Need to sell fast and furiously",
    "gr:hasBusinessFunction": "gr:Sell",
    "gr:hasPriceSpecification": {
        "gr:hasCurrency": "USD",
        "gr:hasCurrencyValue": "85000"
    },
    "gr:includes": {
        "@type": [
            "gr:Individual",
            "pto:Vehicle"
        ],
        "gr:name": "Tesla Roadster",
        "foaf:page": "http://www.teslamotors.com/roadster"
    },
    "gr:name": "Used Tesla Roadster"
};

var jsonLdCompactedDoc5 = {
    "@context": {
        "name": "http://rdf.data-vocabulary.org/#name",
        "ingredient": "http://rdf.data-vocabulary.org/#ingredients",
        "yield": "http://rdf.data-vocabulary.org/#yield",
        "instructions": "http://rdf.data-vocabulary.org/#instructions",
        "step": {
            "@id": "http://rdf.data-vocabulary.org/#step",
            "@type": "xsd:integer"
        },
        "description": "http://rdf.data-vocabulary.org/#description",
        "xsd": "http://www.w3.org/2001/XMLSchema#"
    },
    "ingredient": [
        "12 fresh mint leaves",
        "1/2 lime, juiced with pulp",
        "1 tablespoons white sugar",
        "1 cup ice cubes",
        "2 fluid ounces white rum",
        "1/2 cup club soda"
    ],
    "instructions": [
        {
            "description": "Crush lime juice, mint and sugar together " +
                "in glass.",
            "step": 1
        },
        {
            "description": "Fill glass to top with ice cubes.",
            "step": 2
        },
        {
            "description": "Pour white rum over ice.",
            "step": 3
        },
        {
            "description": "Fill the rest of glass with club soda, stir.",
            "step": 4
        },
        {
            "description": "Garnish with a lime wedge.",
            "step": 5
        }
    ],
    "name": "Mojito",
    "yield": "1 cocktail"
};

var jsonLdCompactedDoc6 = {
    "@context": {
        "dc": "http://purl.org/dc/elements/1.1/",
        "ex": "http://example.org/vocab#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "ex:contains": {
            "@type": "@id"
        }
    },
    "@graph": [
        {
            "@id": "http://example.org/library",
            "@type": "ex:Library",
            "ex:contains": "http://example.org/library/the-republic"
        },
        {
            "@id": "http://example.org/library/the-republic",
            "@type": "ex:Book",
            "ex:contains": "http://example.org/library/" +
                "the-republic#introduction",
            "dc:creator": "Plato",
            "dc:title": "The Republic"
        },
        {
            "@id": "http://example.org/library/the-republic#introduction",
            "@type": "ex:Chapter",
            "dc:description": "An introductory chapter on The Republic.",
            "dc:title": "The Introduction"
        }
    ]
};

var jsonLdCompactedDoc7 = {
    "@context": "http://asjsonld.mybluemix.net",
    "@type": "Post",
    "actor": {
        "@id": "acct:sally@example.org",
        "@type": "Person",
        "displayName": "Sally"
    },
    "object": {
        "@type": "Note",
        "content": "This is a simple note"
    },
    "published": "2015-01-25T12:34:56Z"
};

var jsonLdFlattenedDoc1 = {
    "@context": "http://schema.org/",
    "@graph": [
        {
            "@id": "_:b0",
            "@type": "Person",
            "jobTitle": "Professor",
            "name": "Jane Doe",
            "telephone": "(425) 123-4567",
            "url": "http://www.janedoe.com"
        }
    ]
};

var jsonLdFlattenedDoc2 = {
    "@context": "http://schema.org/",
    "@graph": [
        {
            "@id": "_:b0",
            "http://www.w3.org/2002/12/cal/ical#dtstart": {
                "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
                "@value": "2011-04-09T20:00Z"
            },
            "http://www.w3.org/2002/12/cal/ical#location": "New Orleans " +
                "Arena,New Orleans, Louisiana, USA",
            "http://www.w3.org/2002/12/cal/ical#summary": "Lady Gaga Concert"
        }
    ]
};

var jsonLdFlattenedDoc3 = {
    "@context": {
        "name": "http://schema.org/name",
        "description": "http://schema.org/description",
        "image": {
            "@id": "http://schema.org/image",
            "@type": "@id"
        },
        "geo": "http://schema.org/geo",
        "latitude": {
            "@id": "http://schema.org/latitude",
            "@type": "xsd:float"
        },
        "longitude": {
            "@id": "http://schema.org/longitude",
            "@type": "xsd:float"
        },
        "xsd": "http://www.w3.org/2001/XMLSchema#"
    },
    "@graph": [
        {
            "@id": "_:b0",
            "description": "The Empire State Building is a 102-story" +
                " landmark in New York City.",
            "geo": {
                "@id": "_:b1"
            },
            "image": "http://www.civil.usherbrooke.ca/cours/gci215a/" +
                "empire-state-building.jpg",
            "name": "The Empire State Building"
        },
        {
            "@id": "_:b1",
            "latitude": "40.75",
            "longitude": "73.98"
        }
    ]
};

var jsonLdFlattenedDoc4 = {
    "@context": {
        "gr": "http://purl.org/goodrelations/v1#",
        "pto": "http://www.productontology.org/id/",
        "foaf": "http://xmlns.com/foaf/0.1/",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "foaf:page": {
            "@type": "@id"
        },
        "gr:acceptedPaymentMethods": {
            "@type": "@id"
        },
        "gr:hasBusinessFunction": {
            "@type": "@id"
        },
        "gr:hasCurrencyValue": {
            "@type": "xsd:float"
        }
    },
    "@graph": [
        {
            "@id": "_:b0",
            "gr:hasCurrency": "USD",
            "gr:hasCurrencyValue": "85000"
        },
        {
            "@id": "_:b1",
            "@type": [
                "gr:Individual",
                "pto:Vehicle"
            ],
            "gr:name": "Tesla Roadster",
            "foaf:page": "http://www.teslamotors.com/roadster"
        },
        {
            "@id": "http://example.org/cars/for-sale#tesla",
            "@type": "gr:Offering",
            "gr:acceptedPaymentMethods": "gr:Cash",
            "gr:description": "Need to sell fast and furiously",
            "gr:hasBusinessFunction": "gr:Sell",
            "gr:hasPriceSpecification": {
                "@id": "_:b0"
            },
            "gr:includes": {
                "@id": "_:b1"
            },
            "gr:name": "Used Tesla Roadster"
        }
    ]
};

var jsonLdFlattenedDoc5 = {
    "@context": {
        "name": "http://rdf.data-vocabulary.org/#name",
        "ingredient": "http://rdf.data-vocabulary.org/#ingredients",
        "yield": "http://rdf.data-vocabulary.org/#yield",
        "instructions": "http://rdf.data-vocabulary.org/#instructions",
        "step": {
            "@id": "http://rdf.data-vocabulary.org/#step",
            "@type": "xsd:integer"
        },
        "description": "http://rdf.data-vocabulary.org/#description",
        "xsd": "http://www.w3.org/2001/XMLSchema#"
    },
    "@graph": [
        {
            "@id": "_:b0",
            "ingredient": [
                "12 fresh mint leaves",
                "1/2 lime, juiced with pulp",
                "1 tablespoons white sugar",
                "1 cup ice cubes",
                "2 fluid ounces white rum",
                "1/2 cup club soda"
            ],
            "instructions": [
                {
                    "@id": "_:b1"
                },
                {
                    "@id": "_:b2"
                },
                {
                    "@id": "_:b3"
                },
                {
                    "@id": "_:b4"
                },
                {
                    "@id": "_:b5"
                }
            ],
            "name": "Mojito",
            "yield": "1 cocktail"
        },
        {
            "@id": "_:b1",
            "description": "Crush lime juice, mint and sugar " +
                "together in glass.",
            "step": 1
        },
        {
            "@id": "_:b2",
            "description": "Fill glass to top with ice cubes.",
            "step": 2
        },
        {
            "@id": "_:b3",
            "description": "Pour white rum over ice.",
            "step": 3
        },
        {
            "@id": "_:b4",
            "description": "Fill the rest of glass with club soda, stir.",
            "step": 4
        },
        {
            "@id": "_:b5",
            "description": "Garnish with a lime wedge.",
            "step": 5
        }
    ]
};

var jsonLdFlattenedDoc6 = {
    "@context": {
        "dc": "http://purl.org/dc/elements/1.1/",
        "ex": "http://example.org/vocab#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "ex:contains": {
            "@type": "@id"
        }
    },
    "@graph": [
        {
            "@id": "http://example.org/library",
            "@type": "ex:Library",
            "ex:contains": "http://example.org/library/the-republic"
        },
        {
            "@id": "http://example.org/library/the-republic",
            "@type": "ex:Book",
            "ex:contains": "http://example.org/library/" +
                "the-republic#introduction",
            "dc:creator": "Plato",
            "dc:title": "The Republic"
        },
        {
            "@id": "http://example.org/library/the-republic#introduction",
            "@type": "ex:Chapter",
            "dc:description": "An introductory chapter on The Republic.",
            "dc:title": "The Introduction"
        }
    ]
};

var jsonLdFlattenedDoc7 = {
    "@context": {
        "dc": "http://purl.org/dc/elements/1.1/",
        "ex": "http://example.org/vocab#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "ex:contains": {
            "@type": "@id"
        }
    },
    "@graph": [
        {
            "@id": "_:b0",
            "@type": "http://www.w3.org/ns/activitystreams#Post",
            "http://www.w3.org/ns/activitystreams#actor": {
                "@id": "acct:sally@example.org"
            },
            "http://www.w3.org/ns/activitystreams#object": {
                "@id": "_:b1"
            },
            "http://www.w3.org/ns/activitystreams#published": {
                "@type": "xsd:dateTime",
                "@value": "2015-01-25T12:34:56Z"
            }
        },
        {
            "@id": "_:b1",
            "@type": "http://www.w3.org/ns/activitystreams#Note",
            "http://www.w3.org/ns/activitystreams#content": "This is a " +
                "simple note"
        },
        {
            "@id": "acct:sally@example.org",
            "@type": "http://www.w3.org/ns/activitystreams#Person",
            "http://www.w3.org/ns/activitystreams#displayName": "Sally"
        }
    ]
};

var jsonLdFramedDoc1 = {
    "@graph": [
        {
            "@id": "_:b0",
            "@type": "http://schema.org/Person",
            "http://schema.org/jobTitle": "Professor",
            "http://schema.org/name": "Jane Doe",
            "http://schema.org/telephone": "(425) 123-4567",
            "http://schema.org/url": {
                "@id": "http://www.janedoe.com"
            }
        },
        {
            "@id": "http://www.janedoe.com"
        }
    ]
};

var jsonLdFramedDoc2 = {
    "@graph": [
        {
            "@id": "_:b0",
            "http://www.w3.org/2002/12/cal/ical#dtstart": {
                "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
                "@value": "2011-04-09T20:00Z"
            },
            "http://www.w3.org/2002/12/cal/ical#location": "New Orleans " +
                "Arena, New Orleans, Louisiana, USA",
            "http://www.w3.org/2002/12/cal/ical#summary": "Lady Gaga Concert"
        }
    ]
};

var jsonLdFramedDoc3 = {
    "@graph": [
        {
            "@id": "_:b0",
            "http://schema.org/description": "The Empire State Building is " +
                "a 102-story landmark in New York City.",
            "http://schema.org/geo": {
                "@id": "_:b1",
                "http://schema.org/latitude": {
                    "@type": "http://www.w3.org/2001/XMLSchema#float",
                    "@value": "40.75"
                },
                "http://schema.org/longitude": {
                    "@type": "http://www.w3.org/2001/XMLSchema#float",
                    "@value": "73.98"
                }
            },
            "http://schema.org/image": {
                "@id": "http://www.civil.usherbrooke.ca/cours/gci215a/" +
                    "empire-state-building.jpg"
            },
            "http://schema.org/name": "The Empire State Building"
        },
        {
            "@id": "_:b1",
            "http://schema.org/latitude": {
                "@type": "http://www.w3.org/2001/XMLSchema#float",
                "@value": "40.75"
            },
            "http://schema.org/longitude": {
                "@type": "http://www.w3.org/2001/XMLSchema#float",
                "@value": "73.98"
            }
        },
        {
            "@id": "http://www.civil.usherbrooke.ca/cours/gci215a/" +
                "empire-state-building.jpg"
        }
    ]
};

var jsonLdFramedDoc4 = {
    "@graph": [
        {
            "@id": "_:b0",
            "http://purl.org/goodrelations/v1#hasCurrency": "USD",
            "http://purl.org/goodrelations/v1#hasCurrencyValue": {
                "@type": "http://www.w3.org/2001/XMLSchema#float",
                "@value": "85000"
            }
        },
        {
            "@id": "_:b1",
            "@type": [
                "http://purl.org/goodrelations/v1#Individual",
                "http://www.productontology.org/id/Vehicle"
            ],
            "http://purl.org/goodrelations/v1#name": "Tesla Roadster",
            "http://xmlns.com/foaf/0.1/page": {
                "@id": "http://www.teslamotors.com/roadster"
            }
        },
        {
            "@id": "http://example.org/cars/for-sale#tesla",
            "@type": "http://purl.org/goodrelations/v1#Offering",
            "http://purl.org/goodrelations/v1#acceptedPaymentMethods": {
                "@id": "http://purl.org/goodrelations/v1#Cash"
            },
            "http://purl.org/goodrelations/v1#description": "Need to sell " +
                "fast and furiously",
            "http://purl.org/goodrelations/v1#hasBusinessFunction": {
                "@id": "http://purl.org/goodrelations/v1#Sell"
            },
            "http://purl.org/goodrelations/v1#hasPriceSpecification": {
                "@id": "_:b0",
                "http://purl.org/goodrelations/v1#hasCurrency": "USD",
                "http://purl.org/goodrelations/v1#hasCurrencyValue": {
                    "@type": "http://www.w3.org/2001/XMLSchema#float",
                    "@value": "85000"
                }
            },
            "http://purl.org/goodrelations/v1#includes": {
                "@id": "_:b1",
                "@type": [
                    "http://purl.org/goodrelations/v1#Individual",
                    "http://www.productontology.org/id/Vehicle"
                ],
                "http://purl.org/goodrelations/v1#name": "Tesla Roadster",
                "http://xmlns.com/foaf/0.1/page": {
                    "@id": "http://www.teslamotors.com/roadster"
                }
            },
            "http://purl.org/goodrelations/v1#name": "Used Tesla Roadster"
        },
        {
            "@id": "http://purl.org/goodrelations/v1#Cash"
        },
        {
            "@id": "http://purl.org/goodrelations/v1#Sell"
        },
        {
            "@id": "http://www.teslamotors.com/roadster"
        }
    ]
};

var jsonLdFramedDoc5 = {
    "@graph": [
        {
            "@id": "_:b0",
            "http://rdf.data-vocabulary.org/#ingredients": [
                "12 fresh mint leaves",
                "1/2 lime, juiced with pulp",
                "1 tablespoons white sugar",
                "1 cup ice cubes",
                "2 fluid ounces white rum",
                "1/2 cup club soda"
            ],
            "http://rdf.data-vocabulary.org/#instructions": [
                {
                    "@id": "_:b1",
                    "http://rdf.data-vocabulary.org/#description": "Crush " +
                        "lime juice, mint and sugar together in glass.",
                    "http://rdf.data-vocabulary.org/#step": {
                        "@type": "http://www.w3.org/2001/XMLSchema#integer",
                        "@value": 1
                    }
                },
                {
                    "@id": "_:b2",
                    "http://rdf.data-vocabulary.org/#description": "Fill " +
                        "glass to top with ice cubes.",
                    "http://rdf.data-vocabulary.org/#step": {
                        "@type": "http://www.w3.org/2001/XMLSchema#integer",
                        "@value": 2
                    }
                },
                {
                    "@id": "_:b3",
                    "http://rdf.data-vocabulary.org/#description": "Pour " +
                    "white rum over ice.",
                    "http://rdf.data-vocabulary.org/#step": {
                        "@type": "http://www.w3.org/2001/XMLSchema#integer",
                        "@value": 3
                    }
                },
                {
                    "@id": "_:b4",
                    "http://rdf.data-vocabulary.org/#description": "Fill the " +
                        "rest of glass with club soda, stir.",
                    "http://rdf.data-vocabulary.org/#step": {
                        "@type": "http://www.w3.org/2001/XMLSchema#integer",
                        "@value": 4
                    }
                },
                {
                    "@id": "_:b5",
                    "http://rdf.data-vocabulary.org/#description": "Garnish " +
                            "with a lime wedge.",
                    "http://rdf.data-vocabulary.org/#step": {
                        "@type": "http://www.w3.org/2001/XMLSchema#integer",
                        "@value": 5
                    }
                }
            ],
            "http://rdf.data-vocabulary.org/#name": "Mojito",
            "http://rdf.data-vocabulary.org/#yield": "1 cocktail"
        },
        {
            "@id": "_:b1",
            "http://rdf.data-vocabulary.org/#description": "Crush lime " +
                "juice, mint and sugar together in glass.",
            "http://rdf.data-vocabulary.org/#step": {
                "@type": "http://www.w3.org/2001/XMLSchema#integer",
                "@value": 1
            }
        },
        {
            "@id": "_:b2",
            "http://rdf.data-vocabulary.org/#description": "Fill glass to " +
                "top with ice cubes.",
            "http://rdf.data-vocabulary.org/#step": {
                "@type": "http://www.w3.org/2001/XMLSchema#integer",
                "@value": 2
            }
        },
        {
            "@id": "_:b3",
            "http://rdf.data-vocabulary.org/#description": "Pour white " +
                "rum over ice.",
            "http://rdf.data-vocabulary.org/#step": {
                "@type": "http://www.w3.org/2001/XMLSchema#integer",
                "@value": 3
            }
        },
        {
            "@id": "_:b4",
            "http://rdf.data-vocabulary.org/#description": "Fill the rest of" +
                " glass with club soda, stir.",
            "http://rdf.data-vocabulary.org/#step": {
                "@type": "http://www.w3.org/2001/XMLSchema#integer",
                "@value": 4
            }
        },
        {
            "@id": "_:b5",
            "http://rdf.data-vocabulary.org/#description": "Garnish with " +
                "a lime wedge.",
            "http://rdf.data-vocabulary.org/#step": {
                "@type": "http://www.w3.org/2001/XMLSchema#integer",
                "@value": 5
            }
        }
    ]
};

var jsonLdFramedDoc6 = {
    "@context": {
        "dc": "http://purl.org/dc/elements/1.1/",
        "ex": "http://example.org/vocab#"
    },
    "@graph": [
        {
            "@id": "http://example.org/library",
            "@type": "ex:Library",
            "ex:contains": {
                "@id": "http://example.org/library/the-republic",
                "@type": "ex:Book",
                "ex:contains": {
                    "@id": "http://example.org/library/" +
                        "the-republic#introduction",
                    "@type": "ex:Chapter",
                    "dc:description": "An introductory chapter on " +
                        "The Republic.",
                    "dc:title": "The Introduction"
                },
                "dc:creator": "Plato",
                "dc:title": "The Republic"
            }
        }
    ]
};

var jsonLdFramedDoc7 = {
    "@graph": [
        {
            "@id": "_:b0",
            "@type": "http://www.w3.org/ns/activitystreams#Post",
            "http://www.w3.org/ns/activitystreams#actor": {
                "@id": "acct:sally@example.org",
                "@type": "http://www.w3.org/ns/activitystreams#Person",
                "http://www.w3.org/ns/activitystreams#displayName": "Sally"
            },
            "http://www.w3.org/ns/activitystreams#object": {
                "@id": "_:b1",
                "@type": "http://www.w3.org/ns/activitystreams#Note",
                "http://www.w3.org/ns/activitystreams#content": "This is a " +
                    "simple note"
            },
            "http://www.w3.org/ns/activitystreams#published": {
                "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
                "@value": "2015-01-25T12:34:56Z"
            }
        },
        {
            "@id": "_:b1",
            "@type": "http://www.w3.org/ns/activitystreams#Note",
            "http://www.w3.org/ns/activitystreams#content": "This is a " +
                "simple note"
        },
        {
            "@id": "acct:sally@example.org",
            "@type": "http://www.w3.org/ns/activitystreams#Person",
            "http://www.w3.org/ns/activitystreams#displayName": "Sally"
        }
    ]
};

toGraph(jsonLdDoc1, {printGraph: false});
toGraph(jsonLdDoc2, {printGraph: false});
toGraph(jsonLdDoc3, {printGraph: false});
toGraph(jsonLdDoc4, {printGraph: false});
toGraph(jsonLdDoc5, {printGraph: false});
toGraph(jsonLdDoc6, {printGraph: false});
toGraph(jsonLdDoc7, {printGraph: false});

toGraph(jsonLdExpandedDoc1, {printGraph: false});
toGraph(jsonLdExpandedDoc2, {printGraph: false});
toGraph(jsonLdExpandedDoc3, {printGraph: false});
toGraph(jsonLdExpandedDoc4, {printGraph: false});
toGraph(jsonLdExpandedDoc5, {printGraph: false});
toGraph(jsonLdExpandedDoc6, {printGraph: false});
toGraph(jsonLdExpandedDoc7, {printGraph: false});

toGraph(jsonLdCompactedDoc1, {printGraph: false});
toGraph(jsonLdCompactedDoc2, {printGraph: false});
toGraph(jsonLdCompactedDoc3, {printGraph: false});
toGraph(jsonLdCompactedDoc4, {printGraph: false});
toGraph(jsonLdCompactedDoc5, {printGraph: false});
toGraph(jsonLdCompactedDoc6, {printGraph: false});
toGraph(jsonLdCompactedDoc7, {printGraph: false});

toGraph(jsonLdFlattenedDoc1, {printGraph: false});
toGraph(jsonLdFlattenedDoc2, {printGraph: false});
toGraph(jsonLdFlattenedDoc3, {printGraph: false});
toGraph(jsonLdFlattenedDoc4, {printGraph: false});
toGraph(jsonLdFlattenedDoc5, {printGraph: false});
toGraph(jsonLdFlattenedDoc6, {printGraph: false});
toGraph(jsonLdFlattenedDoc7, {printGraph: false});

toGraph(jsonLdFramedDoc1, {printGraph: false});
toGraph(jsonLdFramedDoc2, {printGraph: false});
toGraph(jsonLdFramedDoc3, {printGraph: false});
toGraph(jsonLdFramedDoc4, {printGraph: false});
toGraph(jsonLdFramedDoc5, {printGraph: false});
toGraph(jsonLdFramedDoc6, {printGraph: false});
toGraph(jsonLdFramedDoc7, {printGraph: false});
