/**
 * Utilities class testing
 */

var test = require('tape')
var is_int = require('../utilities').is_int
var messageFactory = require('../utilities').messageFactory

// Factory
test('messageFactory(Buffer)', function (t) {
	
  	// for alle meldinger
		// genererer buffer basert melding basert pa variable
		// be systemet om a parse den buffer baserte meldingen
		// sjekk at parsingen gir riktig melding og verdier i meldingen
	
	t.end()
})

// Factory
test('is_int(value)', function (t) {
	
  	t.ok(is_int(1) && is_int(-1) && is_int(0),'Integers are correctly identified')
  	t.notOk(is_int(NaN) || is_int(undefined) || is_int(3.14),'Non integers are correctly identified')
	t.end()
})