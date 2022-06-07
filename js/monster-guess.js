"use strict";

window.onload = init;

const guessDomElements = {
    collectDomElements: function () {
        this.submit = document.getElementById("make-guess");
        this.guess = document.getElementById("guess-value");
        this.hints = document.getElementById("monster-hints");
    }
};

var monsters;
var iAmA;
var guessCounter;
var locationsString;

async function getMonster(apiURL) {
    try {
        const monNamePromise = await fetchResource(apiURL)
            .catch((e) => {
                console.log(e.status);
                return null;
            });

        if(monNamePromise.status != 200) {
            console.log("response from the api: " + monNamePromise.status);
            return null;
        }

        const resMon = await monNamePromise.json();
        let monsters = [];

        for(let i = 0; i < resMon.length; i++) {
            monsters.push(resMon[i]);
        }

        return monsters;
    }
    catch(error) {
        console.log(error);
    }
}

async function fetchResource(resource) {
    const res = await fetch(resource);
    return res;
}

async function init() {
    guessDomElements.collectDomElements();
    monsters = await getMonster(`https://mhw-db.com/monsters`);
    guessDomElements.submit.addEventListener("click", checkGuess);
    initializeGame();
}

function initializeGame() {
    let index = parseInt(Math.random() * monsters.length);
    locationsString = "";
    guessCounter = 0;
    iAmA = monsters[index];

    locationsString += iAmA.locations[0].name;

    guessDomElements.hints.innerHTML = `
        <h1>Guess what monster I am!</h1>
        <p>I am a ${iAmA.type} monster and can be found in ${locationsString}</p>
    `
}

function checkGuess() {
    const userGuess = guessDomElements.guess.value.toLowerCase();
    guessDomElements.guess.value = "";
    if(userGuess == iAmA.name.toLowerCase()) {
        guessDomElements.hints.innerHTML = `
            <h1>Well done, you were right!</h1>
            <button id="play-again">Play again</button>
        `;
        document.getElementById("play-again").addEventListener("click", () => {
            initializeGame();
        });
    }
    else if(guessCounter == 0) {
        let newHint = document.createElement("p");
        newHint.innerHTML = `My species is ${iAmA.species}`;
        guessDomElements.hints.appendChild(newHint);
        guessCounter++;
    }
    else if(guessCounter == 1) {
        let newHint = document.createElement("p");
        newHint.innerHTML = `I am weak to ${iAmA.weaknesses[0].element}`;
        guessDomElements.hints.appendChild(newHint);
        guessCounter++;
    }
    else {
        guessDomElements.hints.innerHTML = `
            <h1>Too bad I was a ${iAmA.name}</h1>
            <button id="play-again">Play again</button>
        `;
        document.getElementById("play-again").addEventListener("click", () => {
            initializeGame();
        });
    }
}