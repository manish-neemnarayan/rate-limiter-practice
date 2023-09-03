import readline from "node:readline"

function log(message) {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(message);
}

async function makeRequest(data) {
    const request = await fetch('http://localhost:3000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })

    return request.status
}

export {
    log,
    makeRequest
}