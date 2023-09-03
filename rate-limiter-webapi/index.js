import express from 'express';
import { createWriteStream } from 'node:fs';
import { rateLimit } from 'express-rate-limit';

const app = express();
const port = 3000;

const limiter = rateLimit({
    windowMs: 1000,
    max: 10,
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false
});

app.use(express.json());
app.use(limiter);

const output = createWriteStream('output.ndjson');

app.post("/", async (req, res) => {
    output.write(JSON.stringify(req.body) + "\n");
    const resContent = req.body.title;
    res.send(`${resContent} was posted!`);    
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})

 