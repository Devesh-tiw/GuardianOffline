// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}

// 12 Emergency Scenarios Data
const medicalData = {
    "CPR": { q: "Is the person breathing?", yes: "Recovery Position.", no: "Start CPR: 100bpm." },
    "Choking": { q: "Can they cough?", yes: "Encourage coughing.", no: "Give 5 back blows." },
    "Bleeding": { q: "Is it severe?", yes: "Apply direct pressure.", no: "Clean and bandage." },
    "Snake Bite": { q: "Is there swelling?", yes: "Keep limb still/low.", no: "Keep calm, seek help." },
    "Burn": { q: "Is skin charred?", yes: "Cover loosely, Hospital.", no: "Cool with water 20m." },
    "Heat Stroke": { q: "Are they confused?", yes: "Cool body immediately.", no: "Move to shade, water." },
    "Fracture": { q: "Is bone visible?", yes: "Control bleeding, call.", no: "Immobilize the joint." },
    "Seizure": { q: "Are they shaking?", yes: "Clear area, protect head.", no: "Check breathing." },
    "Poison": { q: "Are they conscious?", yes: "Identify poison, help.", no: "Check airway/breathing." },
    "Electric Shock": { q: "Is source off?", yes: "Check breathing/CPR.", no: "Don't touch! Kill power." },
    "Asthma": { q: "Have inhaler?", yes: "Help them use it.", no: "Sit upright, stay calm." },
    "Drowning": { q: "Out of water?", yes: "Check breathing/CPR.", no: "Rescue safely, don't dive." }
};

let activeEmergency = null;

// Generate Menu on Load
window.onload = () => {
    const grid = document.getElementById("menu-grid");
    Object.keys(medicalData).forEach(key => {
        let btn = document.createElement("button");
        btn.className = "menu-btn";
        btn.innerText = key;
        btn.onclick = () => startEmergency(key);
        grid.appendChild(btn);
    });
};

function startEmergency(type) {
    activeEmergency = type;
    document.getElementById("menu-screen").style.display = "none";
    document.getElementById("guide-screen").style.display = "block";
    document.getElementById("instruction").innerText = medicalData[type].q;
}

// Add this line to the handleInput function in your script.js
function handleInput(isYes) {
    const text = document.getElementById("instruction");
    const btns = document.getElementById("action-btns");
    const displayArea = document.getElementById("display-area");
    const data = medicalData[activeEmergency];

    // Apply the "Result" look
    text.classList.add("result-style");
    text.innerText = isYes ? "✅ STEP: " + data.yes : "✅ STEP: " + data.no;
    
    btns.style.display = "none";

    if (text.innerText.includes("CPR")) {
        startCPRMetronome();
    }
}
function resetApp() {
    // 1. Stop the CPR Metronome if it is running
    if (typeof metronomeInterval !== 'undefined' && metronomeInterval !== null) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
    }

    // 2. Get the elements
    const displayArea = document.getElementById("display-area");
    const text = document.getElementById("instruction");
    const actionBtns = document.getElementById("action-btns");
    const menuScreen = document.getElementById("menu-screen");
    const guideScreen = document.getElementById("guide-screen");

    // 3. Reset the Visuals
    if (displayArea) {
        displayArea.style.backgroundColor = "rgba(30, 41, 59, 0.7)"; // Original Card Color
    }
    
    if (text) {
        text.classList.remove("result-style"); // Remove the green/bold styling
        text.innerText = ""; // Clear the text
    }

    // 4. Show the Buttons and Menu again
    if (actionBtns) actionBtns.style.display = "flex";
    if (guideScreen) guideScreen.style.display = "none";
    if (menuScreen) menuScreen.style.display = "block";

    // 5. Reset logic variables
    stepIndex = 0;
    activeEmergency = null;
    
    console.log("App reset successful");
}