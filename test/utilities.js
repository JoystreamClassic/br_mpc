/**
 * Tests for utilities class
 * Created by Bedeho Mender on 02.07.2014.
 */
var expect = require('chai').expect;
var is_int = require('../utilities').is_int;
var flattenArray = require('../utilities').flattenArray;

// Integer
describe('Utilities', function() {

    describe('is_int', function () {

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

    describe('flattenArray', function () {

        // test array
        var [
            [[2, 1, 1], [3, 4, [0, 1]]],
            [[1, 2, 44 ],[0, 55, 62]]
        ]
        ].forEach(function(e) {

            var b = flattenArray(e);

            expect(b.length).to.be.equal(e.length);

        });



    });

});

