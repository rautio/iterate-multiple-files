import fs from 'fs';
import expect from 'expect';
import iterate from '../src/iterate.js';

describe('Verify that iterate() works with matching file sizes', function(){
  const str1 = '1\n2\n3\n4\n';
  const str2 = '5\n6\n7\n8\n';
  const str3 = '9\n10\n11\n12\n';

  //Write a few files to disk for testing purposes
  fs.writeFileSync('./test/temp_file1.csv',str1);
  fs.writeFileSync('./test/temp_file2.csv',str2);
  fs.writeFileSync('./test/temp_file3.csv',str3);
  const filePaths = ['./test/temp_file1.csv','./test/temp_file2.csv','./test/temp_file3.csv'];
  const expected = [15,18,21,24];
  const expectedTotal = 78;
  let total = 0;
  it('Should return an array of the sums',function(){
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
        expect(actual).toEqual(expected);
      });
  });
  it('Should return a total sum of ' + expectedTotal, function(){
    expect(total).toEqual(expectedTotal);
  });
  //Cleanup
  after(function(){
    fs.unlinkSync('./test/temp_file1.csv');
    fs.unlinkSync('./test/temp_file2.csv');
    fs.unlinkSync('./test/temp_file3.csv');
  });
});

//TODO: Verify that iterate works with mismatching filesizes
//TODO: Verify that iterate works with empty files
//TODO: Negative test cases