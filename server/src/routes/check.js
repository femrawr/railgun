import express from 'express';

const router = express.Router();

router.get('/check', async (_, res) => {
    res.json({ msg: 'railgun' });
});

export default router;