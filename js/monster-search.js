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
    let monsterImage = document.createElement("img");
    let imgUrl = fextraImagePrefix;
    const monName = monster.name;

    monCard.classList.add("info-container");
    
    imgUrl += monster.name.toLowerCase().replace(/ /g, '_');
    imgUrl += "_render_001.png";

    monsterImage.src = imgUrl;
    monsterImage.onerror = () => {
        monsterImage.onerror = "";
        monsterImage.src = monsterImage.src.replace("mhw", "mhwi");
        console.log(monsterImage.src);
        if(monName.toLowerCase() == 'stygian zinogre') {
            monsterImage.src = monsterImage.src.replace("001", "2");
        }
        monCard.innerHTML = `
            <img src=${monsterImage.src} target="_blank" class="monster-picture">
            <h3>${monName}</h3>
        `;
        return true;
    };  

    monCard.innerHTML = `
        <img src=${monsterImage.src} target="_blank" class="monster-picture">
        <h3>${monName}</h3>
    `;

    monSearchDomElements.results.appendChild(monCard);
}

async function monsterSearch() {
    const type = monSearchDomElements.searchType.value;
    let terms = monSearchDomElements.searchTerms.value.replace(/ /g, '-');
    monSearchDomElements.results.innerHTML = "";

    if(type == "monsterName") {
        let adjustedURL = `${URL}?q={"name":{"$like":"%${terms}%"}}`
        const monsterPromise = getMonster(adjustedURL);
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
        let adjustedURL = `${URL}?q={"species":{"$like":"%${terms}%"}}`;
        const monsterPromise = getMonster(adjustedURL);
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