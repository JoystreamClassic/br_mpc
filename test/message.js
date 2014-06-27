/**
 * Message processing testing
 */

var Protocol = require('bittorrent-protocol')
var br_mpc = require('../')
var bencode = require('bencode')
var test = require('tape')

// Check that extension is properly registered: 
test('wire.use(br_mpc())', function (t) {
  var wire = new Protocol()
  //wire.pipe(wire) // why is this piping requiered here?
  wire.use(br_mpc())


  // list
  
  wire.br_mpc.on('list', function () {
    t.pass('List message processed');
    
    wire.br_mpc.onMessage(new Buffer())
  })
  wire.br_mpc.onMessage(new Buffer(br_mpc.MESSAGEID_LIST))
  
  // br_mpc supported
  //t.notok(wire.br_mpc.onExtendedHandshake({m : {br_mpc : 1}}), 'Extended handshake with br_mpc m dictionary key succeeds')
  
  t.end()
})