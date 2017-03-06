var https = require('https');

exports.search = function(apiKey, query) {
    return new Promise((resolve, reject) => {
        console.log('searching with apiKey ' + apiKey + ' and query ' + query);
        var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&key=" + apiKey;
        https.get(url, function (response) {
            var body = '';

            response.on('data', function (chunk) {
                body += chunk;
            });

            response.on('end', function () {
                var places = JSON.parse(body);
                if (places.status == "OK") {
                    resolve(places);
                } else {
                    console.log("Query is invalid: ", query);
                    reject(places);
                }
            });
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            reject(err);
        });
   });
}