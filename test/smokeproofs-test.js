describe('smokeproofs', function () {
  var smokeproofs = null
    , expect = null;

  if (typeof exports === 'object') {
    smokeproofs = require('../src/smokeproofs');
    expect = require('expect.js');
  } else {
    smokeproofs = window.smokeproofs;
    expect = window.expect;
  }

  describe('basic', function () {
    it('should exist', function () {
      smokeproofs();
    });
  });

});
