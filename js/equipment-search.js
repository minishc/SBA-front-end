"use strict";
window.onload = init;

const URL = "https://mhw-db.com";

const searchDomElements = {
    collectDOM: function() {
        this.select = document.getElementById("select-equipment");
        this.searchTerms = document.getElementById("search-terms");
        this.submit = document.getElementById("submit");
        this.results = document.getElementById("search-results");
        this.weaponFilter = document.getElementById("weapon-type");
        this.armorFilter = document.getElementById("armor-slot-filter");
        this.armorGender = document.getElementById("armor-gender");
    }
};
//things to do on window load
function init() {
    searchDomElements.collectDOM();
    searchDomElements.submit.addEventListener("click", executeSearch);
    searchDomElements.select.addEventListener("change", enableRelevantSelect);
    enableRelevantSelect();
}
//for enabling filtering options based on what search type is selected
function enableRelevantSelect() {
    if(searchDomElements.select.value.substring(0, 6) == "weapon") {
        searchDomElements.weaponFilter.disabled = false;
        searchDomElements.armorFilter.disabled = true;
    }
    else {
        searchDomElements.weaponFilter.disabled = true;
        searchDomElements.armorFilter.disabled = false;
    }
}
//function for creating a weapon card to display the results from api call
function createWeaponCard(weapon) {
    let weaponCard = document.createElement("div");
    weaponCard.classList.add("weapon-card");

    const weaponIcon = weapon.assets.icon;
    const weaponName = weapon.name;

    weaponCard.innerHTML = `
        <img src="${weaponIcon}">
        <h3>${weaponName}</h3>
        `;
    
    document.getElementById("equipment-search-results").appendChild(weaponCard);
}
//function for creating an armor card to display the results from api call
function createArmorCard(armor) {
    let armorCard = document.createElement("div");
    armorCard.classList.add("armor-card");

    const armorIcon = armor.assets.imageFemale;
    const armorName = armor.name;

    armorCard.innerHTML = `
        <a class="info-container">
            <img src="${armorIcon}" style="height: 128px; width: 128px;">
            <h3>${armorName}</h3>
        </a>
        `;
    
    document.getElementById("equipment-search-results").appendChild(armorCard);
}
//function to execute when the form for searching is submitted
async function executeSearch() {
    let searchValue = searchDomElements.searchTerms.value.toLowerCase();
    let adjustedSearch = searchValue.replace(/ /g, "-");
    if(searchDomElements.select.value == "weaponName" ||
            searchDomElements.select.value == "armorName") {
        //setting up query parameters with wildcards to get all relevant results
        adjustedSearch = `{"name":{"$like":"%${adjustedSearch}%"}}`;
        if(searchDomElements.select.value == "weaponName") {
            adjustedSearch = `/weapon?q=${adjustedSearch}`; //making additions to URL
            const weaponNamePromise = getWeaponByName((`${URL}${adjustedSearch}`));
            weaponNamePromise.then((weapons) => {
                for(let i = 0; i < weapons.length; i++) {
                    console.log(weapons[i]);
                    createWeaponCard(weapons[i]);
                }
            });
        }
        else {
            adjustedSearch = `/armor?q=${adjustedSearch}`; //making additions to URL
            const armorNamePromise = getArmorByName((`${URL}${adjustedSearch}`));
            armorNamePromise.then((armors) => {
                for(let i = 0; i < armors.length; i++) {
                    console.log(armors[i]);
                    createArmorCard(armors[i]);
                }
            });
        }
    }
}

async function getArmorByName(search) {
    try {
        const res = await fetchWithTimeout(search, {timeout: 5000})
                .catch(e => {
                    console.log(e);
                    return null;
                });
        if(res.status != 200) {
            console.log("status from api call " + res.status);
            return null;
        }

        const resArmor = await res.json();
        console.log(resArmor);
        let armors = [];

        for(let i = 0; i < resArmor.length; i++) {
            armors.push(resArmor[i]);
        }

        return armors;
    }
    catch(error) {
        console.log(error);
    }
}

async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;
  
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  }