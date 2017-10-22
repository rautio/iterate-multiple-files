var mf = require('../src/index.js'),
    expect = require('expect');

describe('.iterate()', function(){
  it('Should be in main',function(){
    expect(typeof mf.iterate).toEqual('function');
  });
});
