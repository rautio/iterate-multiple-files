import fs from 'fs';
import es from 'event-stream';
import stream from 'stream';
import isReadableStream from './isReadableStream';

export default function(filePaths){
  return new Promise(function(resolve, reject){

    let fileComplete = [];
    let initialized = [];
    let lineLoaded = [];
    let streams = [];
    let count = 0;
    let done = false;
    let lines = [];
  
    const linesLoaded = function(){
      for(let i = 0; i < lineLoaded.length; i++){
        if(!lineLoaded[i]){
          return false;
        }
      }
      return true;
    };
  
    const isInitialized = function(){
      let allInitialized = true;
      for(let i = 0; i < initialized.length; i++){
        if(!initialized[i]){
          allInitialized = false;
          break;
        }
      }
      if(allInitialized){
        resolve({
          next: function(){
            let oldLines = [].concat(lines);
            let fileDone = [];
            for(let i = 0 ; i < streams.length; i++){
              if(!streams[i].paused){
                //This stream ended
                fileDone.push(true);
                oldLines[i] = null;
              }
              else{
                streams[i].resume();
                fileDone.push(false);
              }
            }
            let allPaused = true;
            for(let i = 0; i < fileDone.length; i++){
              if(!fileDone[i]){
                allPaused = false;
                break;
              }
            }
            done = allPaused;
            if(!done){
              return {
                value:oldLines,
                done:done
              };
            }
            else{
              return {
                done:done
              };
            }
          }.bind(this)
        });
      }
    };
  
    const areWeDone = function(){
      for(let i = 0; i < fileComplete.length; i++){
        if(!fileComplete[i]){
          return false;
        }
      }
      return true;
    };
  
    for(let i = 0; i < filePaths.length; i++){
      //new entries for each file or stream
      fileComplete.push(false);
      lines.push(null);
      initialized.push(false);
      lineLoaded.push(false);
      let s = filePaths[i];
      if(!isReadableStream(s)){
        s = fs.createReadStream(s);
      }
      streams.push(s
        .pipe(es.split())
        .pipe(es.mapSync(function(line){
          lines[i] = line;
          count++;
          if(!initialized[i]){
            initialized[i] = true;
            isInitialized();
          }
          lineLoaded[i] = true;
          streams[i].pause();
        }.bind(this)))
        .on('error',function(err){
          reject(err);
        }.bind(this))
        .on('end',function(){
          lines[i] = null;
          fileComplete[i] = true;
        })
      );
    }
  });
}
