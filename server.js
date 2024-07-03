const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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


/*
function updateSprites() {
    // Get all the div elements with the class "pokemon"
    var pokemonDivs = document.querySelectorAll(".pokemon");

    // Loop through each div element
    pokemonDivs.forEach(function (div) {
        // Get the data attributes for data-number and data-form
        var dataNumber = div.getAttribute("data-number");
        var dataForm = div.getAttribute("data-form");
        var imgElement = div.querySelector("img");

        // Create a new img link based on data-number and data-form
        if (dataNumber == null) {
            // this is the sprites from the "Show Team List"
            // existing link looks like: https://storage.googleapis.com/files.rk9labs.com/sprites/broadcast/987_000.png
            var existingImgUrl = imgElement.src;
            var url = new URL(existingImgUrl);
            var pathParts = url.pathname.split('/');
            // 987_000.png
            var fileName = pathParts[pathParts.length - 1];
            // 987_000
            var fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

            // Extract the numeric part
            var parts = fileNameWithoutExtension.split("_");
            dataNumber = parts[0];
            // default to 000 if rk9 doesn't provide us the form
            dataForm = parts.length > 1 ? parts[1] : "000";
        }

        var newImgLink = "https://www.serebii.net/scarletviolet/pokemon/new/" + dataNumber + ".png";

        var index = dataNumber + "_" + dataForm;
        if (spritesLink[index])
            newImgLink = spritesLink[index];

        // Reset the margin height for the img
        imgElement.src = newImgLink;
        imgElement.style.margin = "12"; // Set margin to 12px
        imgElement.style.height = "128px"; // Set height to 128px
    });
}
*/