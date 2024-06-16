const express = require('express');
const app = express();
const port = 3000;

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Endpoint to fetch raw data
app.get('/data2', async (req, res) => {
    try {
        const data = await getJSON("2024", "05", "gen9vgc2024reggbo3", "1760");
        res.json(data); // Return the raw data
    } catch (error) {
        res.json({ error: error.message });
    }
});

// Endpoint to fetch and process Pokemon spread data
app.get('/data', async (req, res) => {
    const pokemonName = req.query.name;
    if (!pokemonName) {
        res.json({ error: "No Pokémon name specified." });
        return;
    }

    try {
        const data = await getJSON("2024", "05", "gen9vgc2024reggbo3", "1760");
        if (data) {
            const pokemonData = data.data[pokemonName];
            if (pokemonData) {
                const spreads = pokemonData.Spreads;
                const abilities = pokemonData.Abilities;
                const totalWeight = Object.values(abilities).reduce((sum, weight) => sum + weight, 0);
                
                const spreadPercentages = [];
                for (const spread in spreads) {
                    const percentage = (spreads[spread] / totalWeight) * 100;
                    if (percentage >= 0.5) {
                        spreadPercentages.push({ spread, percentage });
                    }
                }

                spreadPercentages.sort((a, b) => b.percentage - a.percentage);

                res.json(spreadPercentages);
            } else {
                res.json({ error: `${pokemonName} data not found.` });
            }
        } else {
            res.json({ error: "Failed to fetch data." });
        }
    } catch (error) {
        res.json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Helper function to fetch API data
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

// Helper function to get JSON data from the specified URL
async function getJSON(Year, Month, Format, Rating) {
    const url = `https://www.smogon.com/stats/${Year}-${Month}/chaos/${Format}-${Rating}.json`;
    const json = await fetchAPI(url);
    return json;
}
