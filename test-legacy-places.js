const apiKey = 'AIzaSyBiSWPvPscO_34Lg5dXK5qVHY9ZAFGHTlI';
fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=${apiKey}`)
.then(r => r.json()).then(console.log).catch(console.error);
