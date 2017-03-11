var https = require('https');
var fs = require('fs');

module.exports.search = (apiKey, query) => {
    return new Promise((resolve, reject) => {
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
                    console.error("Query is invalid: ", query);
                    reject(places);
                }
            });
        }).on('error', function (err) {
            console.error("Got error: " + err.message);
            reject(err);
        });
   });
}

module.exports.constructSearchQuery = (jsonData) => {
    return new Promise((resolve, reject) => {
        var queryString = jsonData.name + ', ' + jsonData.suburb + ', ' + jsonData.state + ', Australia';
        resolve(encodeURI(queryString));
    });
}

module.exports.read = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
        });
    });
}

module.exports.processAll = (apiKey, fileName) => {
    return module.exports.read(fileName)
                .then((jsonData) => {
                    return module.exports.constructSearchQuery(jsonData)
                })
                .then((searchQuery) => {
                    return module.exports.search(apiKey, searchQuery);
                })
                ;
}