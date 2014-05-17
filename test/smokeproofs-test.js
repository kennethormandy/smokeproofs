describe('smokeproofs', function () {
  var smokeproofs = null
    , expect = null;

  if (typeof exports === 'object') {
    // smokeproofs = require('../')({ 'foo': 'bar' });
    smokeproofs = require('../');
    expect = require('expect.js');
  } else {
    smokeproofs = window.smokeproofs;
    expect = window.expect;
  }

  describe('basic', function () {
    it('should exist', function () {
      expect(smokeproofs()).to.be.an('object'); // I guess…
    });
  });

});
