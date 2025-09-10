import express from 'express';
import env from 'dotenv';
import url from 'url';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

env.config();

const app = express();
app.use(cors());

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.listen(process.env.PORT, () => {
    console.log(`listening on http://localhost:${process.env.PORT}`);
});

const routes = path.join(__dirname, 'routes');
fs.readdirSync(routes).forEach(async file => {
    if (!file.endsWith('.js')) return;

    const route = await import('./routes/' + file);
    app.use(route.default);
});
