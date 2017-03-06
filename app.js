var googlePlace = require('./modules/google-place.js');

function checkUsage() {
    return new Promise((resolve, reject) => {
         if (process.argv.length < 3) {
            reject('Usage: node ' + process.argv[1] + ' API-KEY QUERY');
        } else {
            resolve();
        }
    });
}

var apiKey = process.argv[2];
var query = process.argv[3];
checkUsage()
    .then(() => {
        var result = googlePlace.search(apiKey, query);
        return result;
    })
    .then(result => console.log(result))
    .catch(err => console.log(err));
