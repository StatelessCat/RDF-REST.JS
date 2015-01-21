// jshint node: true

var rdfnode = require('./rdfnode.js');
var canonicalize = rdfnode.canonicalize;
var sameNode = rdfnode.sameNode;
var Promise = require('promise');
var assert = require('assert');


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

exports.graph = function() {
    var that = {};
    var subjects = {};
    that._subjects = subjects; // for easier debug only

    that.addTriple = function (s, p, o) {
        addToIndex(subjects, s, p, canonicalize(o));
    };

    that.removeTriple = function (s, p, o) {
        removeFromIndex(subjects, s, p, canonicalize(o));
    };

    that.containsTriple = function (s, p, o) {
        var found = false;
        try {
            that.forEachTriple(s, p, o, function() { found=true; throw "stop"; });
        }
        catch (err) {
            if (err !== "stop") throw err;
        }
        return found;
    };

    that.forEachTriple = function (s, p, o, callback) {
        var count = 0;
        if (o !== null) o = canonicalize(o);
        function forEachObject(s, p, objects, o, callback) {
            //console.log("---", "fEO", s, p, objects, o);
            var key;
            if (o !== null) {
                key = o['@id'] || o['@value'];
                var candidates = objects[key];
                if (candidates.length) {
                    candidates.forEach(function(c) {
                        if (sameNode(o, c)) {
                            callback(s, p, c);
                            count += 1;
                        }
                    });
                }
            } else {
                for(key in objects) {
                    objects[key].forEach(function(c) {
                        callback(s, p, c);
                        count += 1;
                    });
                }
            }
        }
        function forEachPredicate(s, predicates, p, o, callback) {
            //console.log("---", "fEP", s, p, objects, o);
            var key;
            if (p !== null) {
                key = decanonicalize(p);
                var objects = predicates[key];
                if (objects) forEachObject(s, p, objects, o, callback);
            } else {
                for (key in predicates) {
                    forEachObject(s, { '@id': key }, predicates[key], o, callback);
                }
            }
        }

        var key;
        if (s !== null) {
            key = decanonicalize(s);
            var predicates = subjects[key];
            if (predicates) forEachPredicate(s, predicates, p, o, callback);
        } else {
            for (key in subjects) {
                forEachPredicate({'@id': key}, subjects[key], p, o, callback);
            }
        }
        return count;
    };

    that.countTriples = function () {
        var count = 0;
        that.forEachTriple(null, null, null, function() { count += 1; });
        //    .done(function(val) { count = val; });
        return count;
    };

    return that;
};

exports.copyGraph = function(g1, g2) {
    return new Promise(function(resolve, reject) {
        if (g2 === undefined) {
            g2 = exports.graph();
        }
        g1.forEach(null, null, null, g2.addTriple).then(
            function () { resolve(g2); },
            reject
        );
    });
};


exports.readonlyWrapper = function(g) {
    // TODO implement this correctly
    return g;
};
