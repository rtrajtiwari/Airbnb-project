async function getBoundingBox(city) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&accept-language=en`);
    const data = await response.json();

    if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        const map = L.map('map-container').setView([lat, lon], 12); // Center map at city coordinates

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); // Add OpenStreetMap tiles

        L.marker([lat, lon]).addTo(map) // Add a marker at the city center
            .bindPopup(`<b>${city}</b>`)
            .openPopup();
    } else {
        alert("City not found");
    }
}
