const fs = require('fs');

// 1. Data from your script.js
const ALL_NAMES = ["Eko","Jhen","James","Jel","Renz","Kristel","Somer"];
const NAME_TO_HASH = {
    "Eko": "d3f0c",
    "Jhen": "73532",
    "James": "632a4",
    "Jel": "a793a",
    "Renz": "46862",
    "Kristel": "2711b",
    "Somer": "1a83e"
};
const HASH_TO_NAME = Object.fromEntries(
    Object.entries(NAME_TO_HASH).map(([name, hash]) => [hash, name])
);

// Helper function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 2. Secret Santa Draw Logic
function generatePairings() {
    let givers = [...ALL_NAMES]; // Copy of givers
    let recipients = [...ALL_NAMES]; // Copy of recipients
    
    // Shuffle the lists to randomize the assignments
    shuffle(givers);
    shuffle(recipients);

    let pairingsMap = new Map();
    let maxAttempts = 1000;
    let attempt = 0;

    // Simple loop to ensure no-self-pick rule is met
    while (attempt < maxAttempts) {
        let valid = true;
        let tempPairings = {};

        // 3. Check for the no-self-pick rule
        for (let i = 0; i < givers.length; i++) {
            if (givers[i] === recipients[i]) {
                valid = false;
                break; 
            }
            tempPairings[NAME_TO_HASH[givers[i]]] = NAME_TO_HASH[recipients[i]];
        }

        if (valid) {
            console.log("✅ Valid Pairings Generated:");
            console.log(tempPairings);
            return tempPairings;
        }

        // If invalid, re-shuffle recipients and try again
        shuffle(recipients);
        attempt++;
    }

    console.error("❌ Failed to generate valid pairings after many attempts.");
    return null;
}

// 4. Run the function and save to pairings.json
const newPairings = generatePairings();

if (newPairings) {
    fs.writeFileSync(
        'pairings.json', 
        JSON.stringify(newPairings, null, 2), 
        'utf8'
    );
    console.log("\n📁 New pairings.json file has been created.");
}