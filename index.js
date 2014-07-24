/**
 * Implementation of BEP 43 extension
 * https://github.com/bedeho/BEP43
 * Created by Bedeho Mender on 02.07.2014.
 */

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

var MESSAGE_ID_TO_NAME = require('./variables').MESSAGE_ID_TO_NAME;
var MESSAGE_NAME_TO_ID = require('./variables').MESSAGE_NAME_TO_ID;

var list = require('./message/list');
var offer = require('./message/offer');
var setup_begin = require('./message/setup_begin');

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

        if(buffer.length == 0)
            throw new Error('Buffer empty');
        else
		    var id = buffer[0];

		switch (id) {
		
			case MESSAGE_NAME_TO_ID.list:
				return new list();
            case MESSAGE_NAME_TO_ID.offer:
                return new offer(buffer);
            case MESSAGE_NAME_TO_ID.setup_begin:
                return new setup_begin(buffer);
		}
	};
	
	// Callback for extended message for this extension
	br_mpc.prototype.onMessage = function (buffer) {
		try {
			
			// Parse message
            var m = this._bufferToMessage(buffer);
			var name = MESSAGE_ID_TO_NAME[m.id];
			
			// Emit event
			this.emit(name, m);
			
			// Log
			//console.log('Received message: ' + name);
			
		} catch (err) {
			console.log('Error: ' + err.toString());
		}
	};

	return br_mpc;
};