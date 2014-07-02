/**
 * Extension (br_mpc) testing
 */

var Protocol = require('bittorrent-protocol');
var br_mpc = require('../');
var expect = require('chai').expect;

// Check that extension is properly registered: 
describe('Handler object is registered', function () {

	var wire = new Protocol();
	wire.use(br_mpc());

    it('Handler object is registered', function(){
        expect(wire).to.have.property('br_mpc');
        expect(wire).to.have.deep.property('br_mpc.onHandshake');
        expect(wire).to.have.deep.property('br_mpc.onExtendedHandshake');
        expect(wire).to.have.deep.property('br_mpc.onMessage');
    });
});

// Check that extension is properly registered:
describe('Extended handshake message processing', function () {

    var wire = new Protocol();
    wire.use(br_mpc());
    var handshakeProcessor = wire.br_mpc._supportsExtension;

    it('Extended handshake without br_mpc m dictionary key fails properly', function(){
        expect(handshakeProcessor()).to.be.false;
        expect(handshakeProcessor({})).to.be.false;
        expect(handshakeProcessor({m : []})).to.be.false;
    });

    it('Extended handshake with br_mpc m dictionary key succeeds', function(){
        expect(handshakeProcessor({m : {br_mpc : {}}})).to.be.true;
    });
});

var list = require('../message/list');

// Factory
describe('Message encoding/decoding', function () {
	
	// Create extension object
	var ext = new (br_mpc())();

    it('list', function(){
        var msg = new list();
        b = msg.toBuffer();

        expect(ext._bufferToMessage(b)).to.deep.equal(msg);

        // onMessage fires correct event?
    });
/*
    it('offer', function(){
        var msg = new offer();
        b = msg.toBuffer();

        expect(ext._bufferToMessage(b)).to.deep.equal(msg);

        // onMessage fires correct event?
    });
*/
});