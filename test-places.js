const apiKey = 'AIzaSyBiSWPvPscO_34Lg5dXK5qVHY9ZAFGHTlI';
fetch('https://places.googleapis.com/v1/places:searchText', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress'
  },
  body: JSON.stringify({
    textQuery: 'pizza in new york'
  })
}).then(r => r.json()).then(console.log).catch(console.error);
