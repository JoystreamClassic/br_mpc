/**
 * Implementation of BEP 43 extension
 * https://github.com/bedeho/BEP43
 */

var bencode = require('bencode')
var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits
var messageFactory = require('./utilities').messageFactory
var ID_TO_NAME = require('./variables').ID_TO_NAME

var Message = require('./message/message.js')

module.exports = function () {
	
	inherits(br_mpc, EventEmitter)
	
	function br_mpc (wire) {
		
		EventEmitter.call(this)
		
		// Save protocol stream
		this._wire = wire
	}
	
	// For IE support. Since function.name does not work in IE.
	//br_mpc.prototype.name = 'br_mpc'
	
	// Callback for basic BitTorrent handshake message
	br_mpc.prototype.onHandshake = function (infoHash, peerId, extensions) {
		this._infoHash = infoHash
	}
	
	// Callback for handshake of extended message
	br_mpc.prototype.onExtendedHandshake = function (handshake) {
		
		// Check that br_mpc is supported
	    if (!handshake.m || !handshake.m.br_mpc)
	    	return this.emit('warning', new Error('Peer does not support br_mpc')) 	
	}
	
	// Callback for extended message for this extension
	br_mpc.prototype.onMessage = function (buffer) {
		
		var m;
		
		try {
			
			// Parse message
			m = messageFactory(buffer)
			name = ID_TO_NAME[m.id]
			
			// Emit event
			this.emit(name, m)
			
			// Log
			console.log('Received message: ' + name)
			
		} catch (err) {
			console.log('Error: ' + err.toString())
		}
	}

	return br_mpc
}