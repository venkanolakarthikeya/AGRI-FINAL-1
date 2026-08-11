const fs = require('fs');

let settingsCode = fs.readFileSync('src/components/Settings.tsx', 'utf8');
settingsCode = settingsCode.replace(
    '<LocationAutocomplete \n               location={location} \n               setLocation={setLocation} \n               placeholder={t(language, \'app.notSet\')} \n             />',
    '<LocationAutocomplete \n               location={location} \n               setLocation={setLocation} \n               placeholder={t(language, \'app.notSet\')} \n               language={language}\n             />'
);
fs.writeFileSync('src/components/Settings.tsx', settingsCode);

let soilCode = fs.readFileSync('src/components/SoilForm.tsx', 'utf8');
soilCode = soilCode.replace(
    '<LocationAutocomplete \n                location={soilData.location}\n                setLocation={(loc) => setSoilData(prev => ({ ...prev, location: loc }))}\n                placeholder={t(language, \'soil.location\')}\n              />',
    '<LocationAutocomplete \n                location={soilData.location}\n                setLocation={(loc) => setSoilData(prev => ({ ...prev, location: loc }))}\n                placeholder={t(language, \'soil.location\')}\n                language={language}\n              />'
);
fs.writeFileSync('src/components/SoilForm.tsx', soilCode);
