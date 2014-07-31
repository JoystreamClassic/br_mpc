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

// messages
var list = require('../message/list');
var offer = require('../message/offer');
var setup_begin = require('../message/setup_begin');

// fixtures
var offer_fixtures = require('./fixtures/offer.json');
var setup_begin_fixtures = require('./fixtures/setup_begin.json');

// Check that br_mpc.onMessage fires correct event
describe('Message processing works for', function () {

    // ms Timeout used for all done() call backs
    this.timeout(500);
	
	// Create extension object
	var ext = new (br_mpc())();

    it('list', function(done){
        var msg = new list();
        b = msg.toBuffer();

        ext.on('list',function (m) {
            expect(true).to.be.true;
            done();
        });

        ext.onMessage(b);
    });

    it('offer', function(done){

        var args = offer_fixtures.valid[0].arguments;
        var msg = new offer(args);
        b = msg.toBuffer();

        ext.on('offer',function (m) {
            expect(true).to.be.true;
            done();
        });

        ext.onMessage(b);
    });

    it('setup_begin', function(done){

         var args = setup_begin_fixtures.valid[0].arguments;
         var msg = new setup_begin(args);
         var b = msg.toBuffer();

         ext.on('setup_begin', function(m) {
             expect(true).to.be.true;
             done();
         });

         ext.onMessage(b);
    });

});