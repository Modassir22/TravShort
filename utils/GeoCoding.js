

module.exports.LatLong = async (address)=>{
    let location = address.toString();
    const apiKey = "68330cfa178ec903393717qyw6be9d0";
    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}&api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            return {lat,lon};
        } else {
            console.log("No results found.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Correctly call the function with a string

