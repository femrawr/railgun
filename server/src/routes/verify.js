import express from 'express';
import request from '../utils/request.js';

const router = express.Router();

const options = {
    method: 'POST',
    hostname: 'gmailnator.p.rapidapi.com',
    path: '/inbox',
    headers: {
        'x-rapidapi-key': process.env.API_KEY,
        'x-rapidapi-host': 'gmailnator.p.rapidapi.com',
        'Content-Type': 'application/json'
    }
};

const content = (id) => {
    return {
        method: 'GET',
        hostname: 'gmailnator.p.rapidapi.com',
        path: '/messageid?id=' + id,
        headers: {
            'x-rapidapi-key': process.env.API_KEY,
            'x-rapidapi-host': 'gmailnator.p.rapidapi.com'
        }
    }
};

router.get('/verify', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        res.status(500).json({ error: 'no email provided' });
        return;
    }

    if (!email.endsWith('@gmail.com')) {
        res.status(500).json({ error: 'invalid email provided' });
        return;
    }

    const inbox = await request.request(options, { email: email, limit: 1 });

    if (!Array.isArray(inbox) || inbox.length === 0) {
        res.status(404).json({ error: 'no messages found' });
        return;
    }

    const latest = inbox[0];

    if (Math.floor(Date.now() / 1000) - latest.date > 300) {
        res.status(400).json({ error: 'time difference is too big' });
        return;
    }

    const message = await request.request(content(latest.id));
    const decrypted = message.content;

    if (typeof message !== 'object' || !decrypted) {
        return res.status(404).json({ error: 'no content found' });
    }

    const code = decrypted.match(/Verification code:\s*(\d+)/i);

    return res.json({ content: decrypted, code: code[1] });
});

export default router;