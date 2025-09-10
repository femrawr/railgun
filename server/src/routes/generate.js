import express from 'express';
import request from '../utils/request.js';

const router = express.Router();

const options = {
	method: 'POST',
	hostname: 'gmailnator.p.rapidapi.com',
	port: null,
	path: '/generate-email',
	headers: {
		'x-rapidapi-key': process.env.API_KEY,
		'x-rapidapi-host': 'gmailnator.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
};

router.get('/generate', async (_, res) => {
    try {
        const data = await request.request(options, { options: [6] });

        console.log('generated email: ' + data.email);
        res.json({ email: data.email });
    } catch(e) {
        console.error('failed to generate email: ' + err);
        res.status(500).json({ error: 'failed to generate email: ' + err });
    }
});

export default router;