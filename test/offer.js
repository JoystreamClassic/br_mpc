/**
 * Tests for offer class
 * Created by Bedeho Mender on 02.07.2014.
 */

var expect = require('chai').expect;

var offer = require('../message/offer');
var fixtures = require('./fixtures/offer.json');

describe('offer', function () {

    var fn = function (x) {

        // function which chai will call
        return function () {

            switch (x.length) {
                case 0:
                    new offer();
                    break;
                case 1:
                    new offer(x[0]);
                    break;
                case 2:
                    new offer(x[0], x[1]);
                    break;
                case 3:
                    new offer(x[0], x[1], x[2]);
                    break;
                case 4:
                    new offer(x[0], x[1], x[2], x[3]);
                    break;
                case 5:
                    new offer(x[0], x[1], x[2], x[3], x[4]);
                    break;
            }
        };
    };

    describe('constructor correctly throws when ', function () {

        fixtures.invalid.forEach(function (element) {

            it(element.description, function () {
                expect(fn(element.arguments)).to.throw(element.exception);
            });
        });
    });

    describe('constructor correctly does not throw when ', function () {

        fixtures.valid.forEach(function (element) {

            it(element.description, function () {
                expect(fn(element.arguments)).to.not.throw();
            });
        });
    });

    // add stuff about buffers!!!

});