    /* 
    -----linux
    echo "id,name,desc, age" > big.csv
    for i in `seq 1 5`; do node -e "process.stdout.write('$i,erick-$i,$i-text,$i\n'.repeat(1e5))" >> big.csv; done

    ----windows powershell
    "id,name,desc,age" | Set-Content -Path "big.csv" -Force; for ($i = 1; $i -le 5; $i++) { $line = "$i,erick-$i,$i-text,$i`n"; $line * 100000 | Out-File -Append -FilePath "big.csv" -Encoding utf8 }

    ----windows powershell for checking length of file
    Get-Content -Path "big.csv" | Measure-Object -Line | ForEach-Object { "Lines: $($_.Lines)"; "Words: $(Get-Content -Path 'big.csv' | Measure-Object -Word).Words" }

    **/

    import { createReadStream } from "node:fs"
    import { createWriteStream } from "node:fs";
    import { pipeline }  from "node:stream/promises";
    import csv from "csv-parser";
    import { Transform } from "node:stream";
    import { randomUUID } from "node:crypto";
    import { log, makeRequest } from "./util.js";
    import ThrottleRequest from "./throttle.js";

    const throttle = new ThrottleRequest({
        objectMode: true,
        requestsPerSecond: 10
    })

    const dataProcessor = Transform({
        objectMode: true,
        transform(chunk, encoding, callback) {
            chunk.id = randomUUID();
            console.log(chunk);
            return callback(null, JSON.stringify(chunk));
        }
    })

    const destChunk = async function * (source) {
        console.log("entered")
        let count = 0;
        for await (const chunk of source) {
            log(`Processed ${++count} items... -- ${new Date().toISOString()}`);
            const status = await makeRequest(chunk);
            if(status !== 200) {
                throw new Error(`oops! reached rate limit, stupid!! - status ${status}`)
            }
        }
    }
    console.log("Starting...");
    await pipeline(
        createReadStream("big.csv"),
        csv({ objectMode: true }),
        dataProcessor,
        throttle,
        destChunk
    )
