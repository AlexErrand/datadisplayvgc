const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/data', async (req, res) => {
    try {
        const data = await getJSON("2024", "05", "gen9vgc2024reggbo3", "1760");
        res.json(data);
    } catch (error) {
        res.json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('HTTP error:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function getJSON(Year, Month, Format, Rating) {
    const url = `https://www.smogon.com/stats/${Year}-${Month}/chaos/${Format}-${Rating}.json`;
    const json = await fetchAPI(url);
    return json;
}
