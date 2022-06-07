"use strict";
window.onload = init;

const URL = "https://mhw-db.com";
const fextra = "https://monsterhunterworld.wiki.fextralife.com/";

const searchDomElements = {
    collectDOM: function() {
        this.select = document.getElementById("select-equipment");
        this.searchTerms = document.getElementById("search-terms");
        this.submit = document.getElementById("submit");
        this.results = document.getElementById("equipment-search-results");
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
        searchDomElements.armorGender.disabled = true;
    }
    else {
        searchDomElements.weaponFilter.disabled = true;
        searchDomElements.armorFilter.disabled = false;
        searchDomElements.armorGender.disabled = false;
    }
}
//function for creating a weapon card to display the results from api call
function createWeaponCard(weapon) {
    let weaponCard = document.createElement("div");
    let weaponImage = document.createElement("img");
    weaponCard.classList.add("weapon-card");
    let weaponIcon = "";

    if(weapon.assets != null) {
        weaponIcon = weapon.assets.icon;
    }
    const weaponName = weapon.name;
    let urlAddition = "";
    let endCharacter = parseInt(weaponName.charAt(weaponName.length - 1));
    if(isNaN(endCharacter)) {
        urlAddition = weaponName.replace(/ /g, '+');
        urlAddition = urlAddition.replace(/"/g, "");
    }
    else {
        urlAddition = weaponName.substring(0, weaponName.length - 2).replace(/ /g, '+');
    }
    weaponImage.src = weaponIcon;
    weaponImage.onerror = () => {
        weaponImage.onerror = "";
        weaponImage.src = "../images/notFound.png";
        weaponCard.innerHTML = `
            <a class="info-container" href="${fextra}${urlAddition}" target="_blank">
                <img src="${weaponImage.src}" style="height: 128px; width: 128px;">
                <h3>${weaponName}</h3>
            </a>
        `;
    }
    weaponCard.innerHTML = `
            <a class="info-container" href="${fextra}${urlAddition}" target="_blank">
                <img src="${weaponImage.src}" style="height: 128px; width: 128px;">
                <h3>${weaponName}</h3>
            </a>
        `;
    
    document.getElementById("equipment-search-results").appendChild(weaponCard);
}
//function for creating an armor card to display the results from api call
function createArmorCard(armor) {
    let armorCard = document.createElement("div");
    let armorImage = document.createElement("img");
    armorCard.classList.add("armor-card");
    let armorIcon = "";

    if(armor.assets != null) {
        if(searchDomElements.armorGender.value == "male") {
            armorIcon = armor.assets.imageMale;
        }
        else {
            armorIcon = armor.assets.imageFemale;
        }
    }
    const armorName = armor.name;
    let urlAddition = armorName.replace(/ /g, '+');

    armorImage.src = armorIcon;
    armorImage.onerror = () => {
        armorImage.onerror = "";
        armorImage.src = "../images/armorNotFound.png";
        armorCard.innerHTML = `
            <a class="info-container" href="${fextra}${urlAddition}" target="_blank">
                <img src="${armorImage.src}" style="height: 128px; width: 128px;">
                <h3>${armorName}</h3>
            </a>
        `;
    };
    armorCard.innerHTML = `
        <a class="info-container" href="${fextra}${urlAddition}" target="_blank">
            <img src="${armorImage.src}" style="height: 128px; width: 128px;">
            <h3>${armorName}</h3>
        </a>
        `;
    
    document.getElementById("equipment-search-results").appendChild(armorCard);
}
//function to execute when the form for searching is submitted
async function executeSearch() {
    let searchValue = searchDomElements.searchTerms.value.toLowerCase();
    let adjustedSearch = searchValue.replace(/ /g, "-");
    searchDomElements.results.innerHTML = "";
    if(searchDomElements.select.value == "weaponName" ||
            searchDomElements.select.value == "armorName") {
        //setting up query parameters with wildcards to get all relevant results
        adjustedSearch = `{"name":{"$like":"%${adjustedSearch}%"}}`;
        if(searchDomElements.select.value == "weaponName") {
            adjustedSearch = `/weapons?q=${adjustedSearch}`; //making additions to URL
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
        console.log(search);
        const res = await fetchResource(search)
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
            if(searchDomElements.armorFilter.value != "") {
                if(resArmor[i].type == searchDomElements.armorFilter.value.toLowerCase()) {
                    armors.push(resArmor[i]);
                }
            } 
            else {
                armors.push(resArmor[i]);
            }
        }

        return armors;
    }
    catch(error) {
        console.log(error);
    }
}

async function getWeaponByName(search) {
    try {
        console.log(search);
        const res = await fetchResource(search)
                .catch(e => {
                    console.log(e);
                    return null;
                });
        if(res.status != 200) {
            console.log("status from api call " + res.status);
            return null;
        }

        const resWeapon = await res.json();
        console.log(resWeapon);
        let weapons = [];

        for(let i = 0; i < resWeapon.length; i++) {
            if(searchDomElements.weaponFilter.value != "") {
                if(resWeapon[i].type == searchDomElements.weaponFilter.value.toLowerCase()) {
                    weapons.push(resWeapon[i]);
                }
            } 
            else {
                weapons.push(resWeapon[i]);
            }
        }

        return weapons;
    }
    catch(error) {
        console.log(error);
    }
}

async function fetchResource(resource) {
    const response = await fetch(resource);
    return response;
  }