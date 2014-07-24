/**
 * The subclass for setup_begin_reject message
 * Created by Bedeho Mender on 02.07.2014.
 */

var inherits = require('util').inherits;

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;

/**
 *  Constructor for setup_begin_reject class
 */
function setup_begin_reject() {
	message.call(this, MESSAGE_NAME_TO_ID.setup_begin_reject);
}

module.exports = setup_begin_reject;

// Inherit from Message class
inherits(setup_begin_reject, message);

/**
 *  Recover message into raw buffer form
 */
setup_begin_reject.prototype.toBuffer = function() {

    // Create a buffer with space for id
    var b = new Buffer(1);

    // Save message id
    b[0] = this.id;

    // Return buffer
    return b;
};