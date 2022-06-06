"use strict";
window.onload = init;

const URL = "https://mhw-db.com/monsters";
const fextra = "https://monsterhunterworld.wiki.fextralife.com/";
const fextraImagePrefix = "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-";

const monSearchDomElements = {
    collectDOM: function() {
        this.searchType = document.getElementById("search-strategy");
        this.searchTerms = document.getElementById("search-terms");
        this.submit = document.getElementById("submit-monster-search");
        this.results = document.getElementById("monster-search-results");
    }
}

function init() {
    monSearchDomElements.collectDOM();
    monSearchDomElements.submit.addEventListener("click", monsterSearch);
}

function createMonsterCard(monster) {
    let monCard = document.createElement("div");
    let imgUrl = fextraImagePrefix;
    const monName = monster.name;

    monCard.classList.add("info-container");
    
    imgUrl += monster.name.toLowerCase().replace(/ /g, '_');
    imgUrl += "_render_001.png";

    monCard.innerHTML = `
        <img src=${imgUrl} target="_blank" class="monster-picture">
        <h3>${monName}</h3>
    `;

    monSearchDomElements.results.appendChild(monCard);
}

async function monsterSearch() {
    const type = monSearchDomElements.searchType.value;
    let terms = monSearchDomElements.searchTerms.value.replace(/ /g, '-');
    if(type == "monsterName") {
        let adjustedURL = `${URL}?q={"name":{"$like":"%${terms}%"}}`
        const monsterPromise = getMonsterByName(adjustedURL);
        monsterPromise.then((monsters) => {
            for(let i = 0; i < monsters.length; i++) {
                //for each monster print it's information to the console
                console.log(monsters[i]);
                //create a card for each search result
                createMonsterCard(monsters[i]);
            }
        });
    }
    else if(type == "monsterSpecies") {
        let adjustedURL = `${URL}?q={"name":{"$like":"%${terms}%"}}`;
        const monsterPromise = getMonsterBySpecies(adjustedURL);
        monsterPromise.then((monsters) => {
            for(let i = 0; i < monsters.length; i++) {
                //for each monster print it's information to the console
                console.log(monsters[i]);
                //create a card for each search result
                createMonsterCard(monsters[i]);
            }
        });
    }
}

async function getMonsterByName(apiURL) {
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
        console.log(resMon);
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

async function getMonsterBySpecies(apiURL) {
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
        console.log(resMon);
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