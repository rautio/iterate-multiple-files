[![travis][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url]

[travis-image]: https://travis-ci.org/rautio/iterate-multiple-files.svg?branch=master
[travis-url]: https://travis-ci.org/rautio/iterate-multiple-files
[coveralls-image]:https://coveralls.io/repos/github/rautio/iterate-multiple-files/badge.svg?branch=master
[coveralls-url]:https://coveralls.io/github/rautio/iterate-multiple-files?branch=master
[npm-image]: https://img.shields.io/npm/v/iterate-multiple-files.svg
[npm-url]: https://npmjs.org/package/iterate-multiple-files
[downloads-image]: https://img.shields.io/npm/dm/iterate-multiple-files.svg
[downloads-url]: https://npmjs.org/package/iterate-multiple-files

Iterate through multiple files at the same time line by line.

# Install
```npm install iterate-multiple-files```

# Code Example

## iterate

```javascript
import mf from 'iterate-multiple-files';

let runningSum = 0;

//The function will receive an array of lines in the same order as the input file paths
function operation(lines){
  // The return statement will ensure that the value gets appended to the final
  // array returned either in the promise or callback. If you do not return anything
  // then nothing will be saved to the array - this is good if dealing with large 
  // files and running out of memory.

  // Do any operation in here
  const lineSum = parseInt(lines[0]) + parseInt(lines[1]);
  runningSum += lineSum;
  return lineSum
}

//Using a promise:
mf.iterate(['path-to-file1','path-to-file2'],operation)
  .then(function(result){
    //Do something with the result
    //Result is an array of each line's sum
  })
  .catch(function(err){
    //Handle the error
  });
```
### Using a callback
```javascript
//Using a callback:
mf.iterate(['path-to-file1','path-to-file2'],operation, function(err, result){
  if(err){
    //Handle the error
  }
  //Do something with result  
});
```

## Iterator functionality
Will come in v0.2.0

## Generator functionality
Will come in v0.2.0

## Stream functionality
Will come in a TBD version

# Motivation
Perform operations line by line on files too large to load in memory.

# Contributors
If you are interested in contributing please contact oskari.rautiainen@gmail.com

# License

[MIT](https://vjpr.mit-license.org)