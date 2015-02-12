/*eslint-env node*/

var getCore = require("../src/cores/factory.js").getCore;

require("../src/parsers/json-ld-adapter"); // ensures that parser is registered
var jsonld = require("../src/serializers/jsonld.js").jsonld; // ensures that serializer is registered

var bc = getCore("http://localhost:8080/api/user/54d357ea2f6af8e974000001");

bc.getState()
    .then(function(g) {
        "use strict";
        var jsonLD = "";
        return jsonld(g, function(line) {
            jsonLD += line;
        }).then(function() {
            console.log(jsonLD);
        });
    }).catch(function(reason) {
        "use strict";
        console.log(reason);
    });
