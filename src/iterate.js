import util from 'util';
import fs from 'fs';
import es from 'event-stream';
import stream from 'stream';
import isReadableStream from './isReadableStream';

export default function(filePaths, operationFunction, callback){
  const cb = callback || function(){};
  return new Promise(function(resolve, reject){
    let numFiles = filePaths.length;
    let streams = [];
    let lineNrs = [];
    let lines = [];
    let fileComplete = [];
    let result = [];

    const areWeDone = function(){
      let allDone = true;
      for(let i = 0; i < fileComplete.length; i++){
        if(!fileComplete[i]){
          //It means this file finished before everyone else
          allDone = false;
          break;
        }
      }
      if(allDone){
        resolve(result);
        return cb(null, result);
      }
    };

    const operation = function(){
      let lineNr = lineNrs[0];
      //Find the max line number
      for(let i = 0; i < lineNrs.length; i++){
        if(lineNrs[i] > lineNr){
          lineNr = lineNrs[i];
        }
      }
      let sameLine = true;
      //2 cases that we're on the 'same' line:
      //  1. We're still reading all files and all line numbers match
      //  2. Some files have ended but for the remaining files we're still on
      //     the same line. This is an intended feature but should be noted to
      //     the user because it is not obvious what happens with files of
      //     different size and that they are responsible. This case occurs when
      //     the lineNrs[i] is greater than or equal to that file's # of lines
      for(let i = 0; i < lineNrs.length; i++){
        //lineNrs starts at 0 index, fileComplete starts at 1
        if((lineNrs[i] != lineNr && !fileComplete[i]) || lineNrs[i] == 0){
          sameLine = false;
          break;
        }
      }
      if(sameLine){
        const operationResult = operationFunction(lines);
        //We only add to the result array if the operationFunction provided by
        //the user returns a value. Otherwise we dont. The latter is better for
        //files too large to store in memory.
        if(typeof operationResult != 'undefined'){
          result.push(operationResult);
        }
        //Resume streams and go to the next line
        for(let i = 0; i < streams.length; i++){
          streams[i].resume();
        }
      }
    };

    for( let i = 0; i < filePaths.length; i++){
      //Add new entries for each file
      fileComplete.push(false);
      lines.push(null);
      lineNrs.push(0);
      let s = filePaths[i]; // Could be either a stream or a file at this point
      if(!isReadableStream(s)){
        s = fs.createReadStream(s);
      }
      streams.push(s
        .pipe(es.split())
        .pipe(es.mapSync(function(line){
          streams[i].pause();
          lineNrs[i]++;
          lines[i] = line;
          operation();
        }.bind(this)))
        .on('error',function(err){
          reject(err);
          return cb(err,null);
        })
        .on('end',function(){
          fileComplete[i] = true;
          lines[i] = null;
          areWeDone();
        })
      );
    }
  });
}
