var chai = require('chai');
var expect = chai.expect;
//var chaiAsPromised = require('chai-as-promised');
//chai.use(chaiAsPromised);
var sinon = require('sinon');
var googlePlace = require('../modules/google-place.js');
var PassThrough = require('stream').PassThrough;
var https = require('https');

describe('Google Place', function() {
    beforeEach(function() {
		this.request = sinon.stub(https, 'get');
	});

    it('should return the same value as place search result', function() {
        var expected = { status: 'OK' };
        var response = new PassThrough();
        response.write(JSON.stringify(expected));
        response.end();

        var request = new PassThrough();

        this.request.callsArgWith(1, response)
                    .returns(request);

        googlePlace.search('a', 'b', function(err, result) {
            expect(result).to.deep.equal(expected);
        });
    });

    afterEach(function() {
        https.get.restore();
    });
});
