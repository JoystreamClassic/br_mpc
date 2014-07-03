/**
 * Tests for extension class br_mpc
 * Created by Bedeho Mender on 02.07.2014.
 */

var Protocol = require('bittorrent-protocol');
var br_mpc = require('../');
var expect = require('chai').expect;

// Check that extension is properly registered: 
describe('Handler object is registered', function () {

	var wire = new Protocol();
	wire.use(br_mpc());

    it('br_mpc', function(){
        expect(wire).to.have.property('br_mpc');
    });

    it('br_mpc.onHandshake', function(){
        expect(wire).to.have.deep.property('br_mpc.onHandshake');
    });

    it('br_mpc.onExtendedHandshake', function(){
        expect(wire).to.have.deep.property('br_mpc.onExtendedHandshake');
    });

    it('br_mpc.onMessage', function(){
        expect(wire).to.have.deep.property('br_mpc.onMessage');
    });
});

// Check that extension is properly registered:
describe('Extended handshake message processing', function () {

    var wire = new Protocol();
    wire.use(br_mpc());
    var handshakeProcessor = wire.br_mpc._supportsExtension;

    it('correctly succeeds with m.br_mpc dictionary key', function(){
        expect(handshakeProcessor({m : {br_mpc : {}}})).to.be.true;
    });

    it('correctly fails without m.br_mpc dictionary key', function(){
        expect(handshakeProcessor()).to.be.false;
        expect(handshakeProcessor({})).to.be.false;
        expect(handshakeProcessor({m : []})).to.be.false;
    });
});

var list = require('../message/list');

// Check that br_mpc.onMessage fires correct event
describe('Message processing', function () {
	
	// Create extension object
	var ext = new (br_mpc())();

    /*
    it('list', function(){
        var msg = new list();
        b = msg.toBuffer();

        //expect(ext._bufferToMessage(b)).to.deep.equal(msg);
    });
    */
});