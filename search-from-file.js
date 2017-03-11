var googlePlace = require('./modules/google-place.js');

function checkUsage() {
    return new Promise((resolve, reject) => {
         if (process.argv.length < 4) {
            reject('Usage: node ' + process.argv[1] + ' <api-key> <file>');
        } else {
            resolve();
        }
    });
}

var apiKey = process.argv[2];
var file = process.argv[3];
checkUsage()
    .then(() => {
        return googlePlace.processAll(apiKey, file);
    })
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => console.log(err));
