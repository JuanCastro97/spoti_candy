const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const CLIENT_ID = '7f7604c6076843c382d19a28ad8d858c';
const CLIENT_SECRET = '31dd72a9b2024b178d463f6d1bc9ae8f';
const REDIRECT_URI = 'https://miappmusica.com/callback';

app.get('/login', (req, res) => {
    res.redirect(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`);
});

app.get('/callback', async (req, res) => {
    try {
        const code = req.query.code;
        const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
            },
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });

        const { access_token, refresh_token } = response.data;

        // Aquí puedes guardar los tokens en una base de datos o en una sesión.
        // Por simplicidad, los retornaremos directamente al frontend.

        res.json({ access_token, refresh_token });
    } catch (error) {
        res.status(400).send('Error durante el intercambio del código.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
