var Promise = require('promise');

var readFile = Promise.denodeify(require('fs').readFile);
// now `readFile` will return a promise rather than expecting a callback

function readJSON(filename){
    console.log("oO?");
    return readFile(filename, 'utf8')
        .then(function(data){console.log("j'ai lu le document"); return data;})
        .then(JSON.parse)
        .then(function(data){console.log("j'ai parsé le document"); return data;});
}

readJSON("ex.json")
    .then(function(data) {
        console.log("ensuite... les données ! :");
        console.log(data);
    })
    .then(function(_) {console.log("et encore ensuite")});

setTimeout(function() {
    console.log("c'est déjà fini ?");
}, 1000);
