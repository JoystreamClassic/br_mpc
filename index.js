/**
 * Implementation of BEP 43 extension
 * https://github.com/bedeho/BEP43
 * Created by Bedeho Mender on 02.07.2014.
 */

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

var MESSAGE_ID_TO_NAME = require('./variables').MESSAGE_ID_TO_NAME;
var MESSAGE_NAME_TO_ID = require('./variables').MESSAGE_NAME_TO_ID;

// Import message sub classes
var list = require('./message/list');
var offer = require('./message/offer');
var setup_begin = require('./message/setup_begin');
var setup_begin_reject = require('./message/setup_begin_reject');
var setup_begin_accept = require('./message/setup_begin_accept');
var setup_refund = require('./message/setup_refund');
var setup_refund_signed = require('./message/setup_refund_signed');
var setup_contract_published = require('./message/setup_contract_published');
var setup_contract_completed = require('./message/setup_contract_completed');
var piece_get = require('./message/piece_get');
var piece_missing = require('./message/piece_missing');
var piece_put = require('./message/piece_put');
var piece_payment = require('./message/piece_payment');
var end = require('./message/end');

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
            case MESSAGE_NAME_TO_ID.setup_begin_reject:
                return new setup_begin_reject(buffer);
            case MESSAGE_NAME_TO_ID.setup_begin_accept:
                return new setup_begin_accept(buffer);
            case MESSAGE_NAME_TO_ID.setup_refund:
                return new setup_refund(buffer);
            case MESSAGE_NAME_TO_ID.setup_refund_signed:
                return new setup_refund_signed(buffer);
            case MESSAGE_NAME_TO_ID.setup_contract_published:
                return new setup_contract_published(buffer);
            case MESSAGE_NAME_TO_ID.setup_contract_completed:
                return new setup_contract_completed(buffer);
            case MESSAGE_NAME_TO_ID.piece_get:
                return new piece_get(buffer);
            case MESSAGE_NAME_TO_ID.piece_missing:
                return new piece_missing(buffer);
            case MESSAGE_NAME_TO_ID.piece_put:
                return new piece_put(buffer);
            case MESSAGE_NAME_TO_ID.piece_payment:
                return new piece_payment(buffer);
            case MESSAGE_NAME_TO_ID.end:
                return new end(buffer);
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