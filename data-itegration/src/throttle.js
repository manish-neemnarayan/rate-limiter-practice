import { Transform } from 'node:stream';

export default class ThrottleRequest extends Transform {
    #requestPerSecond = 0;
    #requestCount = 0;

    constructor({
        objectMode,
        requestPerSecond
    }) {
        super({objectMode})
        this.#requestPerSecond = requestPerSecond;
    }

    _transform(chunk, encoding, callback) {
        this.#requestCount++;
        if(!(this.#requestCount >= this.#requestPerSecond)) {
            this.push(chunk);
            return callback(null, chunk)
        }
        console.log("entered!!")
        console.count(this.#requestCount);
        setTimeout(() => {
            this.#requestCount = 0;
            this.push(chunk);
            return callback(null, chunk);
        }, 1000);
    }
}