/**
 * Implementation of BEP 43 extension
 * https://github.com/bedeho/BEP43
 */

var bencode = require('bencode');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

var ID_TO_NAME = require('./variables').ID_TO_NAME;
var NAME_TO_ID = require('./variables').NAME_TO_ID;

var list = require('./message/list');

module.exports = function () {
	
	function br_mpc(wire) {
		EventEmitter.call(this);
		
		// Save protocol stream
		this._wire = wire;
	}
	
	// Setup inheritance
	inherits(br_mpc, EventEmitter);
	
	// Callback for basic BitTorrent handshake message
	br_mpc.prototype.onHandshake = function (infoHash, peerId, extensions) {
		this._infoHash = infoHash;
	};
	
	// Callback for handshake of extended message
	br_mpc.prototype.onExtendedHandshake = function (handshake) {
        if(!_supportsExtension(handshake))
            return this.emit('warning', new Error('Peer does not support br_mpc'));
	};

    // Check that br_mpc is supported
    br_mpc.prototype._supportsExtension = function (handshake) {
        return !!(handshake && handshake.m && handshake.m.br_mpc);
    }
	
	/**
	 * Message object creation based on raw buffer
	 * @param  {Buffer} buffer
	 */
	br_mpc.prototype._bufferToMessage = function (buffer) {
		var id = buffer[0];
		var restOfBuffer = buffer.slice(1, buffer.length); // is this CORRECT? // is this CORRECT?// is this CORRECT?
		
		switch (id) {
		
			case NAME_TO_ID.list:
				return new list();
		}
	};
	
	// Callback for extended message for this extension
	br_mpc.prototype.onMessage = function (buffer) {
		try {
			
			// Parse message
            var m = _bufferToMessage(buffer);
			var name = ID_TO_NAME[m.id];
			
			// Emit event
			this.emit(name, m);
			
			// Log
			console.log('Received message: ' + name);
			
		} catch (err) {
			console.log('Error: ' + err.toString());
		}
	};

	return br_mpc;
};