const fs = require('fs');

let locationCode = fs.readFileSync('src/components/LocationAutocomplete.tsx', 'utf8');
locationCode = locationCode.replace(
    'https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5',
    'https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&accept-language=en'
);
fs.writeFileSync('src/components/LocationAutocomplete.tsx', locationCode);

let weatherCode = fs.readFileSync('src/components/Weather.tsx', 'utf8');
weatherCode = weatherCode.replace(
    'https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1',
    'https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1&accept-language=en'
);
fs.writeFileSync('src/components/Weather.tsx', weatherCode);
