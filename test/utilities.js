/**
 * Utilities class testing
 */

var test = require('tape')
var is_int = require('../utilities').is_int
var messageFactory = require('../utilities').messageFactory

// Factory
test('messageFactory(buffer)', function (t) {
	
	// For each message: build buffer, and confirm that output values match constructor arguments
	
	//msg = new require('../message/list')()
	//messageFactory
	//t.ok()
	
	t.end()
})

// Factory
test('is_int(value)', function (t) {
	
  	t.ok(is_int(1) && is_int(-1) && is_int(0),'Integers are correctly identified')
  	t.notOk(is_int(NaN) || is_int(undefined) || is_int(3.14),'Non integers are correctly identified')
	t.end()
})