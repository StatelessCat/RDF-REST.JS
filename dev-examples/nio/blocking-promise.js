"use strict";

var fs = require('fs');
var Promise = require('promise'); //TODO check why the jslinter don't like

var p = new Promise(function (resolve) {
    var i_m_blocking = function () {
        var contents = fs.readFileSync('/etc/passwd', 'utf8'); // blocking call
        return contents;
    };
    resolve(i_m_blocking());
});

p.then(function (content) { console.log(content); });
console.log("fini");