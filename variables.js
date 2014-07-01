/**
 * Global variables
 */

// Array of messages
var ID_TO_NAME = [
	'list',
	'offer',
	'setup_begin',
	'setup_begin_reject',
	'setup_begin_accept',
	'setup_contract',
	'setup_contract_signed',
	'setup_refund',
	'setup_refund_signed',
	'setup_contract_published',
	'setup_completed',
	'piece_get',
	'piece_missing',
	'piece_put',
	'piece_payment',
	'end'];

module.exports.ID_TO_NAME = ID_TO_NAME;
module.exports.NUM_MSG = ID_TO_NAME.length;

// Generate reverse message lookup
var NAME_TO_ID = {};
for(var i = 0;i < ID_TO_NAME.length;i++) {
	NAME_TO_ID[ID_TO_NAME[i]] = i;
}

module.exports.NAME_TO_ID = NAME_TO_ID;
