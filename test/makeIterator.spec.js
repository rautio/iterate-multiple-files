import fs from 'fs';
import expect from 'expect';
import makeIterator from '../src/makeIterator.js';

describe('.makeIterator(files)', function(){


  const str1 = '1\n2\n3\n4\n';
  const str2 = '5\n6\n7\n8\n';
  const str3 = '9\n10\n11\n12\n';
  const str4 = '9\n10\n11\n';
  const str5 = '9\n10\n11\n12\n';
  const str6 = '';

  //Write a few files to disk for testing purposes
  fs.writeFileSync('./test/temp_makeIterator_file1.csv',str1);
  fs.writeFileSync('./test/temp_makeIterator_file2.csv',str2);
  fs.writeFileSync('./test/temp_makeIterator_file3.csv',str3);
  fs.writeFileSync('./test/temp_makeIterator_file4.csv',str4);
  fs.writeFileSync('./test/temp_makeIterator_file5.csv',str5);
  fs.writeFileSync('./test/temp_makeIterator_file6.csv',str6);
  fs.writeFileSync('./test/temp_makeIterator_file7.csv',str6);
  const filePaths = ['./test/temp_makeIterator_file1.csv','./test/temp_makeIterator_file2.csv','./test/temp_makeIterator_file3.csv'];
  const mismatchFilePaths = ['./test/temp_makeIterator_file4.csv', './test/temp_makeIterator_file5.csv'];
  const emptyFilePaths = ['./test/temp_makeIterator_file6.csv', './test/temp_makeIterator_file6.csv'];
  const expectedTotal = 78;
  it('Should return an object with a next function', function(){
    const iterator = makeIterator(filePaths);
    expect(typeof iterator).toEqual('object');
    // expect(typeof iterator.next).toEqual('function');
  });


  //To help test the iterator with different inputs without rewriting the logic each time
  const iteratorSum = function(filePaths){
    return new Promise(function(resolve, reject){
      let total = 0;
      makeIterator(filePaths)
        .then(function(iterator){
          let complete = false;
          while(!complete){
            let {value, done} = iterator.next();
            if(value){
              const lines = value;
              let lineTotal = 0;
              for(let i = 0; i < lines.length; i++){
                if(lines[i] && lines[i] != ''){
                  lineTotal += parseInt(lines[i]);
                }
              }
              total += lineTotal;
            }
            complete = done;
          }
          resolve(total);
        }).catch(function(err){
          reject(err);
        });

    });
  };

  it('With all files should have calculated a total sum of ' + expectedTotal, function(){
    return iteratorSum(filePaths).then(function(total){
      expect(total).toEqual(expectedTotal);
    });
  });

  it('With a mixture of files and streams should have calculated a total sum of ' + expectedTotal, function(){
    let stream = fs.createReadStream(filePaths[2]);
    let filesAndStream = [ stream ,filePaths[0],filePaths[1]];
    return iteratorSum(filesAndStream).then(function(total){
      expect(total).toEqual(expectedTotal);
    });
  });

  it('With all streams should have calculated a total sum of ' + expectedTotal, function(){
    let streams = [];
    for(let i = 0; i < filePaths.length; i++){
      streams.push(fs.createReadStream(filePaths[i]));
    }
    return iteratorSum(streams).then(function(total){
      expect(total).toEqual(expectedTotal);
    });
  });

  it('With mismatch file sizes should have calculated a total sum of ' + expectedTotal, function(){
    return iteratorSum(mismatchFilePaths).then(function(total){
      expect(total).toEqual(72);
    });
  });

  it('With empty files should have calculated a total sum of ' + 0, function(){
    return iteratorSum(emptyFilePaths).then(function(total){
      expect(total).toEqual(0);
    });
  });

  //Cleanup
  after(function(){
    fs.unlinkSync('./test/temp_makeIterator_file1.csv');
    fs.unlinkSync('./test/temp_makeIterator_file2.csv');
    fs.unlinkSync('./test/temp_makeIterator_file3.csv');
    fs.unlinkSync('./test/temp_makeIterator_file4.csv');
    fs.unlinkSync('./test/temp_makeIterator_file5.csv');
    fs.unlinkSync('./test/temp_makeIterator_file6.csv');
    fs.unlinkSync('./test/temp_makeIterator_file7.csv');
  });
});

//TODO: Negative test cases
