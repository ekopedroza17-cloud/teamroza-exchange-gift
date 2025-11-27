const HASH_LENGTH = 5;
const ALL_NAMES = ["Eko","Jhen","James","Jel","Renz","Kristel","Somer"];
const NAME_TO_HASH = {
    "Eko": 				"d3f0c",
    "Jhen": 				"73532",
    "James":				 "632a4",
    "Jel": 				"a793a",
    "Renz": 				"46862",
    "Kristel": 			"2711b",
    "Somer": 			"1a83e"
};

const HASH_TO_NAME = Object.fromEntries(
    Object.entries(NAME_TO_HASH).map(([name, hash]) => [hash, name])
);

// Read ?name=xxxx from URL
function getGiverHashFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const giverHash = urlParams.get("name");
    return giverHash ? giverHash.trim() : null;
}

function displayError(message) {
    document.getElementById("initial-prompt").style.display = "none";
    const result = document.getElementById("result-area");
    result.style.display = "block";
    result.innerHTML = `<p style="color:red; font-weight:bold;">⚠️ ${message}</p>`;
}

function displayResult(recipientName) {
    document.getElementById("initial-prompt").style.display = "none";
    const result = document.getElementById("result-area");
    result.style.display = "block";

    result.innerHTML = `
        <h2> You are the Secret Santa for:</h2>
        <p id="recipientName" style="font-size: 2.5em; font-weight: bold; color:#A0C22B; font-family: 'Tangerine', cursive;">
            ${recipientName} and Zia, Bella and Haena 😄
        </p>
    `;
}

async function startExchange() {
    const btn = document.getElementById("drawButton");
    btn.disabled = true;
    btn.textContent = "Drawing...";

    const giverHash = getGiverHashFromUrl();

    // Check done in loadInitialGreeting, but keeping the error logic for safety
    if (!giverHash || !HASH_TO_NAME[giverHash]) {
        return displayError("Missing or invalid unique key in the link.");
    }

    // Load pairings.json
    try {
        const response = await fetch("pairings.json", { cache: "no-store" });
        const pairings = await response.json();

        const recipientHash = pairings[giverHash];

        if (!recipientHash) {
            return displayError("Pairing not found for your key.");
        }

        const recipientName = HASH_TO_NAME[recipientHash];
        displayResult(recipientName);

    } catch (err) {
        displayError("Error loading pairings file. Please ensure 'pairings.json' is deployed.");
    }
}


// --- New Initialization Logic ---

function loadInitialGreeting() {
    const giverHash = getGiverHashFromUrl();
    const greetingEl = document.getElementById("greetingMessage");
    const drawButton = document.getElementById("drawButton");
    
    if (!giverHash) {
        // No hash provided, disable button and show error
        greetingEl.innerHTML = "⚠️ **ERROR:** Please use the complete Secret Santa link provided to you.";
        drawButton.disabled = true;
        return;
    }

    const giverName = HASH_TO_NAME[giverHash];
    
    if (!giverName) {
        // Invalid hash, disable button and show error
        greetingEl.innerHTML = "⚠️ **ERROR:** The unique key in your link is invalid.";
        drawButton.disabled = true;
        return;
    }
    
    // Personalize the greeting with bold name
    greetingEl.innerHTML = `Hello **${giverName}**! Click the button below to discover who you will be buying a gift for!`;
}

// Run the initialization function when the script loads
document.addEventListener('DOMContentLoaded', loadInitialGreeting);