var mf = require('../src/index.js'),
    expect = require('expect');

describe('Verify that each function is added to the index', function(){
  it('Should have an iterate function',function(){
    expect(typeof mf.iterate).toEqual('function');
  });
});
