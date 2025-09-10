import https from 'https';

export default {
    request(options, body = null) {
        return new Promise((resolve, reject) => {
            const chunks = [];

            const req = https.request(options, (res) => {
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('error', reject);

                res.on('end', () => {
                    const body = Buffer.concat(chunks).toString();

                    try {
                        const parsed = JSON.parse(body);
                        resolve(parsed);
                    } catch(e) {
                        reject(e);
                    }
                });
            });

            if (body) req.write(JSON.stringify(body));
            req.on('error', reject);
            req.end();
        });
    }
};