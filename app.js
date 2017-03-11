var googlePlace = require('./modules/google-place.js');

function checkUsage() {
    return new Promise((resolve, reject) => {
         if (process.argv.length < 4) {
            reject('Usage: node ' + process.argv[1] + ' <api-key> <query>');
        } else {
            resolve();
        }
    });
}

var apiKey = process.argv[2];
var query = process.argv[3];
checkUsage()
    .then(() => {
        return googlePlace.search(apiKey, query);
    })
    .then(result => console.log(result))
    .catch(err => console.log(err));
