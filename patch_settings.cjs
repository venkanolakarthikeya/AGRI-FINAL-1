const fs = require('fs');

let code = fs.readFileSync('src/translations.ts', 'utf8');

const englishUpdates = {
    profile: "Profile Details",
    name: "Name",
    email: "Email",
    phone: "Phone Number"
};

const hindiUpdates = {
    profile: "प्रोफ़ाइल विवरण",
    name: "नाम",
    email: "ईमेल",
    phone: "फ़ोन नंबर"
};

const teluguUpdates = {
    profile: "ప్రొఫైల్ వివరాలు",
    name: "పేరు",
    email: "ఇమెయిల్",
    phone: "ఫోన్ నంబర్"
};

function insertUpdates(lang, updates) {
    const searchStr = lang + ": {";
    const target = code.indexOf(searchStr);
    if (target === -1) return;
    
    const settingsTarget = code.indexOf('settings: {', target);
    if (settingsTarget !== -1) {
        const insertPoint = settingsTarget + 'settings: {'.length;
        code = code.slice(0, insertPoint) + 
            "\n      profile: \"" + updates.profile + "\",\n      name: \"" + updates.name + "\",\n      email: \"" + updates.email + "\",\n      phone: \"" + updates.phone + "\"," + 
            code.slice(insertPoint);
    }
}

insertUpdates('English', englishUpdates);
insertUpdates('Hindi', hindiUpdates);
insertUpdates('Telugu', teluguUpdates);

fs.writeFileSync('src/translations.ts', code);
