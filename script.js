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
        <p>This is your assignment. Keep it secret!</p>
    `;
}

async function startExchange() {
    const btn = document.getElementById("drawButton");
    btn.disabled = true;
    btn.textContent = "Drawing...";

    const giverHash = getGiverHashFromUrl();

    if (!giverHash) {
        return displayError("Missing unique key in the link.");
    }

    if (!HASH_TO_NAME[giverHash]) {
        return displayError("Invalid unique key.");
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
        displayError("Error loading pairings file.");
    }
}
