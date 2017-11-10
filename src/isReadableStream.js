import util from 'util';
import stream from 'stream';

const Readable = stream.Readable;

const ReadableStream = function(readableStream, options) {
    let me = this;
    Readable.call(me, options);

    readableStream.on("data", function(chunk) {
        me.push(chunk);
    });

    readableStream.on('end', function() {
        me.push(null);
    });

    readableStream.on("error", function(err) {
        me.push(err);
    });
    me._read = function() {
    };
};

util.inherits(ReadableStream, Readable);

export default function(obj) {
    return obj instanceof stream.Stream &&
      typeof (obj._read === 'function') &&
      typeof (obj._readableState === 'object');
}
