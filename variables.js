/**
 * Global variables
 * Created by Bedeho Mender on 02.07.2014.
 */

// Array of messages
var MESSAGE_ID_TO_NAME = [
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

module.exports.MESSAGE_ID_TO_NAME = MESSAGE_ID_TO_NAME;
module.exports.NUM_MSG = MESSAGE_ID_TO_NAME.length;

// Generate reverse message lookup
var MESSAGE_NAME_TO_ID = {};
for(var i = 0;i < MESSAGE_ID_TO_NAME.length;i++) {
    MESSAGE_NAME_TO_ID[MESSAGE_ID_TO_NAME[i]] = i;
}

module.exports.MESSAGE_NAME_TO_ID = MESSAGE_NAME_TO_ID;

//Array of currencies
var CURRENCY_ID_TO_NAME = [
    'BitCoin',
    'LiteCoin',
    'DogeCoin',
    'SwapCoin'
];

module.exports.CURRENCY_ID_TO_NAME = CURRENCY_ID_TO_NAME;
module.exports.NUM_CURRENCIES = CURRENCY_ID_TO_NAME.length;

// Generate reverse message lookup
var CURRENCY_NAME_TO_ID = {};
for(var i = 0;i < CURRENCY_ID_TO_NAME.length;i++)
    CURRENCY_NAME_TO_ID[CURRENCY_ID_TO_NAME[i]] = i;

module.exports.CURRENCY_NAME_TO_ID = CURRENCY_NAME_TO_ID;

// Transaction field sizes
module.exports.PKH_SIZE = 25;
module.exports.TX_HASH_SIZE = 32;
module.exports.MAX_DER_SIZE = 73;
module.exports.MIN_DER_SIZE = 50; // Not sure about this, wiki says it can become shorter than 70 with exp. decreasing probability
//module.exports.TX_OUTPUT_INDEX_SIZE = 4;