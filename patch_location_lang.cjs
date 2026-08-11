const fs = require('fs');
let code = fs.readFileSync('src/components/LocationAutocomplete.tsx', 'utf8');

code = code.replace(
    'interface LocationAutocompleteProps {',
    'interface LocationAutocompleteProps {\n  language?: string;'
);

code = code.replace(
    'export function LocationAutocomplete({ location, setLocation, placeholder }: LocationAutocompleteProps) {',
    'export function LocationAutocomplete({ location, setLocation, placeholder, language = "English" }: LocationAutocompleteProps) {'
);

code = code.replace(
    'accept-language=en',
    'accept-language=${language === "Hindi" ? "hi" : language === "Telugu" ? "te" : "en"}'
);

fs.writeFileSync('src/components/LocationAutocomplete.tsx', code);
