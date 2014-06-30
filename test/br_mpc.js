/**
 * Basic testing
 */

var Protocol = require('bittorrent-protocol')
var br_mpc = require('../')
var bencode = require('bencode')
var test = require('tape')

// Check that extension is properly registered: 
test('wire.use(br_mpc())', function (t) {
	
	t.plan(6);
	
	var wire = new Protocol()
	//wire.pipe(wire)  // why is this piping required here?
	wire.use(br_mpc())

	t.ok(wire.br_mpc, 'Check that handler object is registered')
	t.ok(wire.br_mpc.onHandshake, 'Check that handler has handshake callback')
	t.ok(wire.br_mpc.onExtendedHandshake, 'Check that handler extended handhsake callback')
	t.ok(wire.br_mpc.onMessage, 'Check that handler handler has message callback')
  
	// br_mpc not supported
	wire.br_mpc.on('warning', function (err) {
		t.pass('Extended handshake without br_mpc m dicitonary key fails properly');
	}).onExtendedHandshake(1)
  
	// br_mpc supported
	t.notok(wire.br_mpc.onExtendedHandshake({m : {br_mpc : 1}}), 'Extended handshake with br_mpc m dictionary key succeeds')

})

// Correct event is fired:
test('wire.onMessage(buffer)', function (t) {
	
  	// for alle meldinger
	// correct message is invoked
	
	t.end()
})