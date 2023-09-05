import { Transform } from 'node:stream';

export default class ThrottleRequest extends Transform {
    #requestsPerSecond = 0;
    #requestCount = 0;

    constructor({
        objectMode,
        requestsPerSecond
    }) {
        super({objectMode})
        this.#requestsPerSecond = requestsPerSecond;
    }

    _transform(chunk, encoding, callback) {
        this.#requestCount++;
        if(!(this.#requestCount >= this.#requestsPerSecond)) {
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

// import { Transform } from 'node:stream';

// export default class ThrottleRequest extends Transform {
//     #requestsPerSecond = 0;
//     #requestCount = 0;
//     #interval = null;

//     constructor({ objectMode, requestsPerSecond }) {
//         super({ objectMode });
//         this.#requestsPerSecond = requestsPerSecond;
//     }

//     _transform(chunk, encoding, callback) {
//         console.log("in throttle...")
//         this.#requestCount++;

//         if (this.#requestCount <= this.#requestsPerSecond) {
//             this.push(chunk);
//             console.count(this.#requestCount);
//             return callback(null, chunk);
//         } else {
//             // Pause processing for one second
//             this.pauseProcessing();
//             setTimeout(() => {
//                 this.#requestCount = 0;
//                 this.resumeProcessing();
//                 this.push(chunk);
//                 console.count(this.#requestCount);
//                 return callback(null, chunk);
//             }, 1000);
//         }
//     }

//     pauseProcessing() {
//         clearInterval(this.#interval);
//         this.#interval = null;
//         this.pause();
//     }

//     resumeProcessing() {
//         if (!this.#interval) {
//             this.#interval = setInterval(() => this.resume(), 1000);
//         }
//     }
// }
