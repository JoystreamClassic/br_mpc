/**
 * Implementation of BEP 43 extension
 * https://github.com/bedeho/BEP43
 */

var BitField = require('bitfield')
var bencode = require('bencode')
var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits

// MPC message IDs
var MESSAGEID_LIST = 1
var MESSAGEID_OFFER = 2
var MESSAGEID_SETUP_BEGIN = 3
var MESSAGEID_SETUP_BEGIN_REJECT = 4
var MESSAGEID_SETUP_BEGIN_ACCEPT = 5
var MESSAGEID_SETUP_CONTRACT = 6
var MESSAGEID_SETUP_CONTRACT_SIGNED = 7
var MESSAGEID_SETUP_REFUND = 8
var MESSAGEID_SETUP_REFUND_SIGNED = 9
var MESSAGEID_SETUP_CONTRACT_PUBLISHED = 10
var MESSAGEID_SETUP_COMPLETED = 11
var MESSAGEID_PIECE_GET = 12
var MESSAGEID_PIECE_MISSING = 13
var MESSAGEID_PIECE_PUT = 14
var MESSAGEID_PIECE_PAYMENT = 15
var MESSAGEID_END = 16
	
module.exports = function (metadata) {
	
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
		
		// Get ID from start of buffer
		message_id = buffer[0];
		
		switch (message_id) {
		
			case MESSAGEID_LIST:
				return this._List()
			/*
		    case MESSAGEID_OFFER:
		    	return this._onMpcOffere()
		    case MESSAGEID_SETUP_BEGIN:
		    	return this._onMpcSetupBegin()
		    case MESSAGEID_SETUP_BEGIN_REJECT:
		    	return this._onMpcSetupBeginReject()
		    case MESSAGEID_SETUP_BEGIN_ACCEPT:
		    	return this._onHave(buffer.readUInt32BE(1))
		    case MESSAGEID_SETUP_CONTRACT:
		    	return this._onBitField(buffer.slice(1))
		    case MESSAGEID_SETUP_CONTRACT_SIGNED:
		    	return this._onRequest(buffer.readUInt32BE(1),
		          buffer.readUInt32BE(5), buffer.readUInt32BE(9))
		    case MESSAGEID_SETUP_REFUND:
		    	return this._onPiece(buffer.readUInt32BE(1),
		          buffer.readUInt32BE(5), buffer.slice(9))
		    case MESSAGEID_SETUP_REFUND_SIGNED:
		    	return this._onCancel(buffer.readUInt32BE(1),
		          buffer.readUInt32BE(5), buffer.readUInt32BE(9))
		    case MESSAGEID_SETUP_CONTRACT_PUBLISHED:
		    	return this._onPort(buffer.readUInt16BE(1))
		    case MESSAGEID_SETUP_COMPLETED:
		    	return this._onExtended(buffer.readUInt8(1), buffer.slice(2))
		    case MESSAGEID_PIECE_GET:
			    return this._onPort(buffer.readUInt16BE(1))
			case MESSAGEID_PIECE_MISSING:
			    return this._onExtended(buffer.readUInt8(1), buffer.slice(2))
			case MESSAGEID_PIECE_PUT:
				return this._onPort(buffer.readUInt16BE(1))
			case MESSAGEID_PIECE_PAYMENT:
				return this._onExtended(buffer.readUInt8(1), buffer.slice(2))
			case MESSAGEID_END:
			    return this._onExtended(buffer.readUInt8(1), buffer.slice(2))*/
		  }
		  
		  this.emit('unknown_message', buffer)
	}
	
	//
	// Consider putting these message handler is separate files later
	//
	
	br_mpc.prototype._onList = function () {
		return this.emit('list')
	}

	return br_mpc
}