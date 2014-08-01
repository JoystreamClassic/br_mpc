/**
 * The subclass for setup_contract_published message
 * Created by Bedeho Mender on 01.08.2014.
 */

var inherits = require('util').inherits;

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;

/**
 *  Constructor for setup_contract_published class
 */
function setup_contract_published() {
	message.call(this, MESSAGE_NAME_TO_ID.setup_contract_published);
}

module.exports = setup_contract_published;

// Inherit from Message class
inherits(setup_contract_published, message);