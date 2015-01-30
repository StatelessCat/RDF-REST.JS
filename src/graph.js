// jshint node: true

var Promise = require('promise');
var assert = require('assert');

var rdfnode = require('./rdfnode.js');
var canonicalize = rdfnode.canonicalize;
var sameNode = rdfnode.sameNode;


function decanonicalize(n) {
    var id = n['@id'];
    assert(id !== undefined);
    return id;
}

function addToIndex(index, key1, key2, val) {
    key1 = decanonicalize(key1);
    var subindex1 = index[key1];
    if (subindex1 === undefined) {
        subindex1 = index[key1] = {};
    }
    key2 = decanonicalize(key2);
    var subindex2 = subindex1[key2];
    if (subindex2 === undefined) {
        subindex2 = subindex1[key2] = {};
    }
    var key3 = val['@id'] || val['@value'];
    var vals = subindex2[key3];
    if (vals === undefined) {
        vals = subindex2[key3] = [];
    }
    var found = false;
    vals.forEach(function (otherval) {
        if(sameNode(val, otherval)) found=true;
    });
    if (!found) {
        vals.push(val);
    }
}

function removeFromIndex(index, key1, key2, val) {
    key1 = decanonicalize(key1);
    var subindex1 = index[key1];
    if (subindex1 === undefined) {
        return;
    }
    key2 = decanonicalize(key2);
    var subindex2 = subindex1[key2];
    if (subindex2 === undefined) {
        return;
    }
    var key3 = val['@id'] || val['@value'];
    var vals = subindex2[key3];
    if (vals === undefined) {
        return;
    }
    var newvals = [];
    vals.forEach(function (otherval) {
        if(!sameNode(val, otherval)) newvals.push(otherval);
    });
    if (newvals.length) {
        subindex2[key3] = newvals;
    } else {
        delete subindex2[key3];
        if (!Object.keys(subindex2).length) {
            delete subindex1[key2];
            if (!Object.keys(subindex1).length) {
                delete index[key1];
            }
        }
    }
}

function forEachObject(s, p, objects, o, handler, promises) {
    //console.log("---", "fEO", s, p, objects, o);
    var key;
    if (o !== null) {
        key = o['@id'] || o['@value'];
        var candidates = objects[key];
        if (candidates.length) {
            candidates.forEach(function(c) {
                if (sameNode(o, c)) {
                    promises.push(Promise.resolve(handler(s, p, c)));
                }
            });
        }
    } else {
        for(key in objects) {
            objects[key].forEach(function(c) {
                promises.push(Promise.resolve(handler(s, p, c)));
            });
        }
    }
}

function forEachPredicate(s, predicates, p, o, handler, promises) {
    //console.log("---", "fEP", s, predicates, p, o);
    var key;
    if (p !== null) {
        key = decanonicalize(p);
        var objects = predicates[key];
        if (objects) forEachObject(s, p, objects, o, handler, promises);
    } else {
        for (key in predicates) {
            forEachObject(s, { '@id': key }, predicates[key], o, handler, promises);
        }
    }
}


exports.graph = function() {
    var that = {};
    var subjects = {};
    that._subjects = subjects; // for easier debug only

    that.addTriple = function (s, p, o) {
        /** 
            Promises to add triple (s, p, o) to that graph.

            The promise won't fail if the triple is already there.

            stability: 2
            (return value, if any, is stil to be decided)
        */
        return new Promise(function(resolve, reject) {
            resolve(
                addToIndex(subjects, s, p, canonicalize(o))
            );
        });
    };

    that.removeTriple = function (s, p, o) {
        /** 
            Promises to remove triple (s, p, o) from that graph.

            The promise won't fail if the triple is not there.

            stability: 2
            (return value, if any, is stil to be decided)
        */
        return new Promise(function(resolve, reject) {
            resolve(
                removeFromIndex(subjects, s, p, canonicalize(o))
            );
        });
    };

    that.containsTriple = function (s, p, o) {
        /** 
            Promises a boolean indicating whether triple (s, p, o) is in that graph.

            stability: 3
        */
        var found = false;
        var prom = that.forEachTriple(s, p, o, function() {
            found = true;
        }).then(
            function() {
                return found;
            }
        );
        return prom;
    };

    that.forEachTriple = function (s, p, o, handler) {
        /** 
            Promises to call 'handler' on every triple matching (s, p, o).

            stability: 1
            yet to decide if handlers must be ran in parallel or in sequence.
            parallel seems more general, but sequence is usefull
            1/ to allows to stop early if one fails...
            2/ for serializers
            may be we need both semantics?
            or may be we must return an array of promises,
            and let the user decide (with Promise.all or Promise.any) ?
        */
        //console.log('---', 'fET', s, p, o);
        if (o !== null) o = canonicalize(o);
        var key;
        var promises = [];
        if (s !== null) {
            key = decanonicalize(s);
            var predicates = subjects[key];
            if (predicates) forEachPredicate(s, predicates, p, o, handler, promises);
        } else {
            for (key in subjects) {
                forEachPredicate({'@id': key}, subjects[key], p, o, handler, promises);
            }
        }
        return Promise.all(promises);
    };

    that.countTriples = function () {
        /** 
            Promises to provide the number of triples in that graph.

            stability: 3
        */
        var count = 0;
        return that.forEachTriple(null, null, null, function() { count += 1; })
            .then(function() {
                return count;
            });
    };

    return that;
};

exports.copyGraph = function(g1, g2) {
    return new Promise(function(resolve, reject) {
        if (g2 === undefined) {
            g2 = exports.graph();
        }
        g1.forEachTriple(null, null, null, g2.addTriple).then(
            function () { resolve(g2); },
            reject
        );
    });
};


exports.readonlyWrapper = function(g) {
    // TODO implement this correctly
    return g;
};

// TODO alternative to readonlyWrapper: cowWrapper (Copy On Write) ?
