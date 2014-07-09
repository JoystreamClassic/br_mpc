/**
 * Tests for utilities class
 * Created by Bedeho Mender on 02.07.2014.
 */
var expect = require('chai').expect;
var is_int = require('../utilities').is_int;

// Integer
describe('Utilities', function() {

    describe('is_int(value)', function () {

        it('False negatives', function () {
            expect(is_int(1)).to.be.true;
            expect(is_int(-1)).to.be.true;
            expect(is_int(0)).to.be.true;
        });

        it('False positives', function () {
            expect(is_int(NaN)).to.be.false;
            expect(is_int(undefined)).to.be.false;
            expect(is_int(3.14)).to.be.false;
        });
    });
});


/*// Unit size
 var size = _format_to_size[format];

 // Net size of full buffer
 var net_size = size * num_elements;

 // Create raw buffer with random data
 var raw_octets = []
 for(var i = 0;i < net_size;i++)
 raw_octets[i] = 3*(i + 1) - 1;  // just picked something

 var buffer = new Buffer(raw_octets);

 describe(format, function () {

 // Create fresh wrapper with offset at zero
 var wrapper = new BufferWrapper(buffer);

 // Read
 var data = wrapper.readArray(format, dimensions);

 // check data read
 it('correctly read data', function () {

 // function to flatten array for comparison
 var f = (function flatten(arr) {




 } );




 //
 //expect(data).to.equal(buffer[fn_name](0));
 });


 // Check offset
 it('offset changed correctly', function () {
 expect(wrapper.getOffset()).to.equal(net_size);
 });
 */