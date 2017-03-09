var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var sinon = require('sinon');
//require('sinon-as-promised')
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

        this.request.callsArgWith(1, httpsResponse)
                    .returns(request);

        var result = googlePlace.search('randomAPI', 'randomQuery');
        return expect(result).to.eventually.deep.equal(expected);
    });

    it('should reject with invalid request status', () => {
        var expected = { status: 'INVALID_REQUEST' };

        var httpsResponse = new PassThrough();
        httpsResponse.write(JSON.stringify(expected));
        httpsResponse.end();

        var request = new PassThrough();

        this.request.callsArgWith(1, httpsResponse)
                    .returns(request);

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

    afterEach(() => {
        https.get.restore();
    });
});
