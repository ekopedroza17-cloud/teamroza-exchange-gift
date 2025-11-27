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
    
    // Hide loading animation if it was running before error
    document.getElementById("loading-animation").style.display = "none"; 
    
    // Show final reveal container with the error message
    const finalReveal = document.getElementById("final-reveal");
    finalReveal.style.display = "block";
    finalReveal.innerHTML = `<p style="color:red; font-weight:bold;">⚠️ ${message}</p>`;
}

function displayResult(recipientName) {
    // 1. Hide loading animation
    document.getElementById("loading-animation").style.display = "none";
    
    // 2. Populate name into the final reveal container
    const recipientNameEl = document.getElementById("recipientName");
    recipientNameEl.innerHTML = `
        <span style="font-size: 2.5em; font-weight: bold; color:#A0C22B; font-family: 'Tangerine', cursive;">
            ${recipientName} and Zia, Bella and Haena 😄
        </span>
    `;
    
    // 3. Show the final reveal container
    document.getElementById("final-reveal").style.display = "block";
}

async function startExchange() {
    const btn = document.getElementById("drawButton");
    btn.disabled = true;
    btn.textContent = "Checking Santa's List...";

    const giverHash = getGiverHashFromUrl();

    if (!giverHash || !HASH_TO_NAME[giverHash]) {
        return displayError("Missing or invalid unique key in the link.");
    }
    
    // 1. Hide the initial prompt and show the result area
    document.getElementById("initial-prompt").style.display = "none";
    document.getElementById("result-area").style.display = "block";
    
    // 2. Show the loading animation (spinner and text)
    document.getElementById("loading-animation").style.display = "block";


    // Load pairings.json
    try {
        const response = await fetch("pairings.json", { cache: "no-store" });
        const pairings = await response.json();

        const recipientHash = pairings[giverHash];

        if (!recipientHash) {
            return displayError("Pairing not found for your key.");
        }

        const recipientName = HASH_TO_NAME[recipientHash];
        
        // Magical Christmas Delay (3 seconds) before revealing
        setTimeout(() => {
            displayResult(recipientName);
        }, 3000); 

    } catch (err) {
        displayError("Error loading pairings file. Please ensure 'pairings.json' is deployed.");
    }
}


// --- Initialization Logic ---

function loadInitialGreeting() {
    
    // 🎵 Music Autoplay Attempt (moved from startExchange to run on load)
    const music = document.getElementById("bgMusic");
    if (music) {
        music.volume = 0.5; 
        music.play().catch(e => {
            // This is the standard catch for blocked autoplay.
            // If it fails, the music will automatically start on the user's first interaction (the button click)
            console.log("Autoplay blocked. Music will start on button click.");
        });
    }
    
    const giverHash = getGiverHashFromUrl();
    const greetingEl = document.getElementById("greetingMessage");
    const drawButton = document.getElementById("drawButton");
    
    if (!giverHash) {
        greetingEl.innerHTML = "⚠️ **ERROR:** Please use the complete Secret Santa link provided to you.";
        drawButton.disabled = true;
        return;
    }

    const giverName = HASH_TO_NAME[giverHash];
    
    if (!giverName) {
        greetingEl.innerHTML = "⚠️ **ERROR:** The unique key in your link is invalid.";
        drawButton.disabled = true;
        return;
    }
    
    // Personalize the greeting with bold name
    greetingEl.innerHTML = `Hello ${giverName}! Click the button below to discover who you will be buying a gift for!`;
}

// Run the initialization function when the script loads
document.addEventListener('DOMContentLoaded', loadInitialGreeting);