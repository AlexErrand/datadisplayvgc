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

async function displayCalyrexIceDetails() {
    const data = await getJSON("2024", "05", "gen9vgc2024reggbo3", "1760");

    if (data) {
        const calyrexIce = data.data['Calyrex-Ice'];
        
        if (calyrexIce) {
            const spreads = calyrexIce.Spreads;
            const totalWeight = calyrexIce.Abilities['asoneglastrier']; // Total weight

            // Calculate percentages
            const spreadPercentages = [];
            for (const spread in spreads) {
                const percentage = (spreads[spread] / totalWeight) * 100;
                if (percentage >= 0.5) {
                    spreadPercentages.push({ spread, percentage });
                }
            }

            // Sort percentages in descending order
            spreadPercentages.sort((a, b) => b.percentage - a.percentage);

            // Log percentages
            console.log("Calyrex-Ice Spreads Percentages:");
            for (const { spread, percentage } of spreadPercentages) {
                console.log(`${spread}: ${percentage.toFixed(2)}%`);
            }
        } else {
            console.log("Calyrex-Ice data not found.");
        }
    } else {
        console.log("Failed to fetch data.");
    }
}

async function fetchPokemonNames() {
    const data = await getJSON("2024", "05", "gen9vgc2024reggbo3", "1760");

    if (data && data.data) {
        const pokemonNames = Object.keys(data.data);
        console.log("Pokémon Names:");
        pokemonNames.forEach(name => {
            console.log(name);
        });
    } else {
        console.error('Error fetching Pokémon names:', data ? data.error : 'No data returned');
    }
}

// Call the functions for testing
displayCalyrexIceDetails();
fetchPokemonNames();
