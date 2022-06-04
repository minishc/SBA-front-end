"use strict";
window.onload = init;

const URL = "https://mhw-db.com";

const searchDomElements = {
    collectDOM: function() {
        this.select = document.getElementById("select-equipment");
        this.searchTerms = document.getElementById("search-terms");
        this.submit = document.getElementById("submit");
        this.results = document.getElementById("search-results");
    }
};

function init() {
    searchDomElements.collectDOM();
    searchDomElements.submit.addEventListener("click", executeSearch);
    searchDomElements.select
}

async function executeSearch() {
    let searchValue = searchDomElements.searchTerms.value.toLowerCase();
    let adjustedSearch = searchValue.replace(/ /g, "-");
    if(searchDomElements.select.value == "weaponName" ||
            searchDomElements.select.value == "armorName") {
        adjustedSearch = `{"name":{"$like":"%${adjustedSearch}%"}}`;
        if(searchDomElements.select.value == "weaponName") {
            adjustedSearch = `/weapon?q=${adjustedSearch}`;
        }
        else {
            adjustedSearch = `/armor?q=${adjustedSearch}`;
        }
        const armorNamePromise = getArmorByName((`${URL}${adjustedSearch}`));
        armorNamePromise.then((armor) => {
          console.log(armor);
        });
    }
    else {

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

        for(let i = 0; i < armors.length; i++) {
            // createArmorResult(armors[i]);
        }
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