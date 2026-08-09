fetch('https://nominatim.openstreetmap.org/search?q=pizza+in+new+york&format=json&addressdetails=1&limit=5', {
    headers: {
        'User-Agent': 'AgriApp/1.0'
    }
})
.then(r => r.json()).then(console.log).catch(console.error);
