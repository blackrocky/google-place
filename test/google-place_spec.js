var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var sinon = require('sinon');
require('sinon-as-promised');
var googlePlace = require('../modules/google-place.js');
var PassThrough = require('stream').PassThrough;
var https = require('https');

describe('Google Place', () => {
    beforeEach(() => {
		this.request = sinon.stub(https, 'get');
	});

    it('should return status OK', () => {
        var expected = { status: 'OK' };

        var httpsResponse = new PassThrough();
        httpsResponse.write(JSON.stringify(expected));
        httpsResponse.end();

        var request = new PassThrough();

        this.request.callsArgWith(1, httpsResponse).returns(request);

        var result = googlePlace.search('randomAPI', 'randomQuery');
        return expect(result).to.eventually.deep.equal(expected);
    });

    it('should reject with invalid request status', () => {
        var expected = { status: 'INVALID_REQUEST' };

        var httpsResponse = new PassThrough();
        httpsResponse.write(JSON.stringify(expected));
        httpsResponse.end();

        var request = new PassThrough();

        this.request.callsArgWith(1, httpsResponse).returns(request);

        var result = googlePlace.search('randomAPI', 'randomQuery');
        return expect(result).to.be.rejectedWith(expected);
    });

    it('should reject with error', () => {
        var expectedError = new Error('randomError');

        var request = new PassThrough();
        this.request.returns(request);

        var result = googlePlace.search('randomAPI', 'randomQuery');
        request.emit('error', expectedError);
        return expect(result).to.be.rejectedWith(expectedError);
    });

    it('should construct search query', () => {
        var jsonData = { name : 'some random coffee shop', suburb : 'Sydney', state : 'NSW' };
        var result = googlePlace.constructSearchQuery(jsonData);
        return expect(result).to.eventually.equal(encodeURI('some random coffee shop, Sydney, NSW, Australia'));
    });

    it('should read from file', () => {
        var expectedContent =
            [
              {
                "name": "Guzzle",
                "suburb": "Sydney",
                "state": "NSW"
              },
              {
                "name": "Nook",
                "suburb": "Sydney",
                "state": "NSW"
              }
            ];
        var content = googlePlace.read('./test/sample-places.json');
        return expect(content).to.eventually.deep.equal(expectedContent);
    });

    it('should process all', () => {
        var readStub = sinon.stub(googlePlace, 'read').resolves({"name": "Guzzle","suburb": "Sydney","state": "NSW"});
        var constructSearchQueryStub = sinon.stub(googlePlace, 'constructSearchQuery').resolves('randomPlace,%20Sydney,%20NSW,%20Australia');
        var searchStub = sinon.stub(googlePlace, 'search').resolves({ status : "OK" });

        googlePlace.processAll('randomApiKey', 'randomFileName');

        return Promise.all([
                readStub()
                    .then((jsonData) =>
                        expect(jsonData).to.deep.equal({"name": "Guzzle","suburb": "Sydney","state": "NSW"})
                    ),
                constructSearchQueryStub()
                    .then((queryString) =>
                        expect(queryString).to.equal('randomPlace,%20Sydney,%20NSW,%20Australia')
                     ),
                searchStub()
                    .then((places) =>
                        expect(places).to.deep.equal({ status : "OK" })
                    )
            ]);
    });

    afterEach(() => {
        https.get.restore();
    });
});
