/**
 * Utilities class testing
 */
var expect = require('chai').expect;
var is_int = require('../utilities').is_int;

// Integer
describe('is_int(value)', function(){

    it('False negatives', function(){
        expect(is_int(1)).to.be.true;
        expect(is_int(-1)).to.be.true;
        expect(is_int(0)).to.be.true;
    });

    it('False positives', function(){
        expect(is_int(NaN)).to.be.false;
        expect(is_int(undefined)).to.be.false;
        expect(is_int(3.14)).to.be.false;
    });
});