import fs from 'fs';
import expect from 'expect';
import iterate from '../src/iterate.js';

describe('.iterate(files, operation).then', function(){
  const str1 = '1\n2\n3\n4\n';
  const str2 = '5\n6\n7\n8\n';
  const str3 = '9\n10\n11\n12\n';
  const str4 = '9\n10\n11\n';
  const str5 = '10\n11\n13\n14\n';
  const str6 = '';

  //Write a few files to disk for testing purposes
  fs.writeFileSync('./test/temp_iterator_file1.csv',str1);
  fs.writeFileSync('./test/temp_iterator_file2.csv',str2);
  fs.writeFileSync('./test/temp_iterator_file3.csv',str3);
  fs.writeFileSync('./test/temp_iterator_file4.csv',str4);
  fs.writeFileSync('./test/temp_iterator_file5.csv',str5);
  fs.writeFileSync('./test/temp_iterator_file6.csv',str6);
  fs.writeFileSync('./test/temp_iterator_file7.csv',str6);
  const filePaths = ['./test/temp_iterator_file1.csv','./test/temp_iterator_file2.csv','./test/temp_iterator_file3.csv'];
  const mismatchFilePaths = ['./test/temp_iterator_file4.csv', './test/temp_iterator_file5.csv'];
  const emptyFilePaths = ['./test/temp_iterator_file6.csv', './test/temp_iterator_file7.csv'];
  const expected = [15,18,21,24];
  const expectedTotal = 78;
  let total = 0;
  
  it('With all files should return an array of sums',function(){
    total = 0;
    return iterate(filePaths, function(lines, lineNr){
      //end of line or mismatching file lengths will return blank or null respectively
      //We added an end of line new-line to our files above
      let lineTotal = 0;
      let countEmpty = 0;
      for(let i = 0; i < lines.length; i++){
        if(lines[i] && lines[i] != ''){
          lineTotal += parseInt(lines[i]);
        }
        else{
          countEmpty++;
        }
      }
      total += lineTotal;
      if(countEmpty != lines.length){
        return lineTotal;
      }
    })
    .then(function(actual){
      expect(actual).toEqual(expected);
    });
  });
  it('With all files should have calculated a total sum of ' + expectedTotal, function(){
    expect(total).toEqual(expectedTotal);
  });

  it('With a mixture of files and streams should still return the same array of sums',function(){
    total = 0;
    let stream = fs.createReadStream(filePaths[2]);
    let filesAndStream = [ stream ,filePaths[0],filePaths[1]];
    return iterate(filesAndStream, function(lines, lineNr){
      //end of line or mismatching file lengths will return blank or null respectively
      //We added an end of line new-line to our files above
      let lineTotal = 0;
      let countEmpty = 0;
      for(let i = 0; i < lines.length; i++){
        if(lines[i] && lines[i] != ''){
          lineTotal += parseInt(lines[i]);
        }
        else{
          countEmpty++;
        }
      }
      total += lineTotal;
      if(countEmpty != lines.length){
        return lineTotal;
      }
    })
    .then(function(actual){
      expect(actual).toEqual(expected);
    });
  });
  it('With a mixture of files and streams should still have calculated a total sum of ' + expectedTotal, function(){
    expect(total).toEqual(expectedTotal);
  });

  it('With all streams should still return the same array of sums',function(){
    total = 0;
    let streams = [];
    for(let i = 0; i < filePaths.length; i++){
      streams.push(fs.createReadStream(filePaths[i]));
    }
    return iterate(streams, function(lines, lineNr){
      //end of line or mismatching file lengths will return blank or null respectively
      //We added an end of line new-line to our files above
      let lineTotal = 0;
      let countEmpty = 0;
      for(let i = 0; i < lines.length; i++){
        if(lines[i] && lines[i] != ''){
          lineTotal += parseInt(lines[i]);
        }
        else{
          countEmpty++;
        }
      }
      total += lineTotal;
      if(countEmpty != lines.length){
        return lineTotal;
      }
    })
    .then(function(actual){
      expect(actual).toEqual(expected);
    });
  });
  it('With all streams should still have calculated a total sum of ' + expectedTotal, function(){
    expect(total).toEqual(expectedTotal);
  });

  it('With mismatched file sizes should return an array of sums',function(){
    total = 0;
    return iterate(mismatchFilePaths, function(lines, lineNr){
      //end of line or mismatching file lengths will return blank or null respectively
      //We added an end of line new-line to our files above
      let lineTotal = 0;
      let countEmpty = 0;
      for(let i = 0; i < lines.length; i++){
        if(lines[i] && lines[i] != ''){
          lineTotal += parseInt(lines[i]);
        }
        else{
          countEmpty++;
        }
      }
      total += lineTotal;
      if(countEmpty != lines.length){
        return lineTotal;
      }
    })
    .then(function(actual){
      expect(actual).toEqual([19,21,24,14]);
    });
  });
  it('With mismatched file sizes should have calculated a total sum of ' + expectedTotal, function(){
    expect(total).toEqual(expectedTotal);
  });

  it('With empty file sizes should return an empty array',function(){
    total = 0;
    return iterate(emptyFilePaths, function(lines, lineNr){
      //end of line or mismatching file lengths will return blank or null respectively
      //We added an end of line new-line to our files above
      let lineTotal = 0;
      let countEmpty = 0;
      for(let i = 0; i < lines.length; i++){
        if(lines[i] && lines[i] != ''){
          lineTotal += parseInt(lines[i]);
        }
        else{
          countEmpty++;
        }
      }
      total += lineTotal;
      if(countEmpty != lines.length){
        return lineTotal;
      }
    })
    .then(function(actual){
      expect(actual).toEqual([]);
    });
  });
  it('With empty files should have calculated a total sum of ' + 0, function(){
    expect(total).toEqual(0);
  });

  //Cleanup
  after(function(){
    fs.unlinkSync('./test/temp_iterator_file1.csv');
    fs.unlinkSync('./test/temp_iterator_file2.csv');
    fs.unlinkSync('./test/temp_iterator_file3.csv');
    fs.unlinkSync('./test/temp_iterator_file4.csv');
    fs.unlinkSync('./test/temp_iterator_file5.csv');
    fs.unlinkSync('./test/temp_iterator_file6.csv');
    fs.unlinkSync('./test/temp_iterator_file7.csv');
  });
});

//TODO: Negative test cases
