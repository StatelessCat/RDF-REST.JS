// jshint node: true

var http = require('http');
var https = require('https');
var url = require('url');
var Promise = require('promise');

var copyGraph = require('../graph.js').copyGraph;
var graph = require('../graph.js').graph;
var readonlyWrapper = require('../graph.js').readonlyWrapper;
var getParser = require('../parsers/factory.js').getParser;
var getSerializer = require('../serializers/factory.js').getSerializer;

var MAX_AGE_REGEX = /max-age=([0-9]+)/;

var HttpCore = function(iri) {
    if (!(this instanceof HttpCore)) return new HttpCore(iri);
    //console.log('---', 'new HttpCore', iri);

    var that = this;

    that.iri = iri;
    var _parsedIri = url.parse(iri);
    var _request;
    if (_parsedIri.protocol === 'http:') {
        _request = http.request;
        if (_parsedIri.port === null) {
            _parsedIri.port = 80;
        }
    } else if (_parsedIri.protocol === 'https:') {
        _request = https.request;
        if (_parsedIri.port === null) {
            _parsedIri.port = 443;
        }
    } else {
        throw "Unsupported protocol: " + this._parsedIri.protocol;
    }
    var _graph;
    var _etag;
    var _validUntil;
    var _editDepth = 0;
    var _editableGraph = null;

    that.getState = function(forceRefresh) {
        return new Promise(function(resolve, reject) {
            if (!forceRefresh  &&  _validUntil  &&  Date.now() <= _validUntil) {
                resolve(_graph);
                return;
            }
            var options = {
                hostname: _parsedIri.hostname,
                port: _parsedIri.port,
                path: _parsedIri.path,
                method: 'GET',
                headers: {
                    // TODO generate accept header based on registered parsers?
                }
            };
           if (!forceRefresh && _etag) {
                options.headers['if-none-match'] = _etag;
            }
            var req = _request(options, function(res) {
                if (res.statusCode === 200 || res.statusCode === 304) {
                    _etag = res.headers.etag;
                    var match = MAX_AGE_REGEX.exec(res.headers['cache-control']);
                    _validUntil = match ?
                        (Date.now() + Number(match[1])*1000) : undefined;
                    if (res.statusCode === 304) {
                        resolve(_graph);
                        return;
                    }
                    _graph = graph();
                    var p = getParser({
                        contentType:'application/debug+json',
                        graph: _graph
                    });
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        p.addChunk(chunk);
                    });
                    res.on('end', function() {
                        p.finalize().then(resolve(_graph));
                    });
                } else {
                    reject("Unsupported statusCode " + res.statusCode);
                    // TODO handle redirections correctly?
                }
            });

            req.on('error', function(err) {
                reject(err);
            });
            req.end();
        }).then(function(theGraph) {
            return readonlyWrapper(theGraph);
        })
        ;
    };

    that.edit = function(editor, forceRefresh) {
        var p;
        _editDepth += 1;
        if (_editDepth === 1) {
            //console.log('---', 'copying graph');
            var req, reqProm, serialize;
            p = that.getState(forceRefresh)
                .then(function() {
                    return copyGraph(_graph);
                })
                .then(function(copiedGraph) {
                    _editableGraph = copiedGraph;
                    return editor(_editableGraph);
                })
                .then(function() {
                    //console.log('---', 'commiting _editableGraph');
                    var ctype = 'application/ld+json'; // TODO decide based on server?
                    serialize = getSerializer({
                        contentType: ctype,
                        graph: _editableGraph
                    });
                    var options = {
                        hostname: _parsedIri.hostname,
                        port: _parsedIri.port,
                        path: _parsedIri.path,
                        method: 'PUT',
                        headers: {
                            'content-type': ctype
                        }
                    };
                    if (_etag) {
                        options.headers['if-match'] = _etag;
                    }
                    reqProm = new Promise(function(resolve, reject) {
                        req = _request(options, function(res) {
                            resolve(res);
                        });
                        req.on('error', function(err) {
                            reject(err);
                        });
                    });
                })
                .then(function() {
                    return serialize(function(chunk) { req.write(chunk); });
                })
                .then(function() {
                    req.end();
                    return reqProm;
                })
                .then(function(res) {
                    return new Promise(function(resolve, reject) {
                        if (res.statusCode / 100 === 2) {
                            _etag = res.headers.etag;
                            var match = MAX_AGE_REGEX.exec(res.headers['cache-control']);
                            _validUntil = match ?
                                (Date.now() + Number(match[1])*1000) : undefined;
                            _graph = graph();
                            var p = getParser({
                                contentType:'application/debug+json',
                                graph: _graph
                            });
                            res.setEncoding('utf8');
                            res.on('data', function (chunk) {
                                p.addChunk(chunk);
                            });
                            res.on('end', function() {
                                p.finalize().then(resolve(readonlyWrapper(_graph)));
                            });
                        } else {
                            reject("Unsupported statusCode " + res.statusCode);
                            // TODO handle redirections??
                        }
                    });
                })
            ;
        } else {
            //console.log('---', 'reusing _editableGraph');
            p = Promise.resolve(_editableGraph)
                .then(
                    editor
                );
        }
        p.then(function() {
            _editDepth -= 1;
            if (_editDepth === 0) _editableGraph = null;
        });
        return p;
    };

    that.postGraph = function(graph) {
        /**
           Promises to process the posted graph.
           
           Not implemented in BasicCore.
           
           stability: 3
        */
        return Promise.reject("can't post graph to BasicCore");
    };

    that.delete = function() {
        /**
           Promises to delete this core.
           
           Not implemented in BasicCore.
           
           stability: 3
        */
        return Promise.reject("can't delete BasicCore");
    };

    Object.freeze(that);
};

exports.HttpCore = HttpCore;
