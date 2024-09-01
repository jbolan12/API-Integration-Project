const express = require('express');
const axios = require('axios');
require('dotenv').config();
console.log('CoinAPI Key:', process.env.COINAPI_KEY);

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Route to render the index page
app.get('/', (req, res) => {
    res.render('index', { data: null, error: null });
});

// Route to fetch the exchange rate
app.get('/price', async (req, res) => {
    const base = req.query.base.toUpperCase();
    const quote = req.query.quote.toUpperCase();

    try {
        const response = await axios.get(`https://rest.coinapi.io/v1/exchangerate/${base}/${quote}`, {
            headers: { 'X-CoinAPI-Key': process.env.COINAPI_KEY }
        });

        res.render('index', { data: response.data, error: null });
    } catch (error) {
        console.error(error);

        let errorMessage = "An error occurred while fetching the exchange rate.";
        if (error.response) {
            errorMessage = `Error: ${error.response.data.error}`;
        }

        res.render('index', { data: null, error: errorMessage });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
