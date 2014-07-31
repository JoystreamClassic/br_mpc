/**
 * Generic test routine for all message subclasses
 * Created by Bedeho Mender on 31.07.2014.
 */

var expect = require('chai').expect;

// Run generic test for all relevant subclasses
['offer','setup_begin'].forEach(function(name) {

    describe(name, function () {

        // load external modules/fixture
        var ctr = function() { console.log(name); }; // require('../message/' + name);
        var fixtures = require('./fixtures/' + name + '.json');

        var fn = function (arg) {

            // function which chai will call
            return function () {
                return new ctr(arg);
            };
        };

        describe('constructor throws when passed ', function () {

            it('to few arguments', function () {
                expect(function () {
                    return new ctr();
                }).to.throw('Invalid argument: To few arguments provided.');
            });

            fixtures.invalid.forEach(function (element) {

                it(element.description, function () {
                    expect(fn(element.arguments)).to.throw(element.exception);
                });
            });
        });

        describe('constructor does not throw when passed', function () {

            fixtures.valid.forEach(function (element) {

                it(element.description, function () {
                    expect(fn(element.arguments)).to.not.throw();
                });
            });
        });

        describe.only('composition of encoding and decoding is consistent when passed', function () {

            fixtures.valid.forEach(function (element) {

                it(element.description, function () {

                    // Create message from arguments
                    var msg = fn(element.arguments)();

                    // Create raw buffer version
                    var b = msg.toBuffer();

                    // Create message from raw buffer version
                    var o = new ctr(b);

                    // Compare them
                    expect(o.equals(msg)).to.be.true;
                });
            });
        });

    });

});