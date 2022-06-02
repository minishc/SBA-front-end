"use strict";
window.onload = init;

const URL = "https://pokeapi.co/api/v2";

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
}

async function executeSearch() {
    // let searchValue = searchDomElements.searchTerms.value.toLowerCase();
    // let adjustedSearch = searchValue.replace(/ /g, "-");
    // if(searchDomElements.select.value == "weaponName" ||
    //         searchDomElements.select.value == "armorName") {
    //     adjustedSearch = `{"name":{"$like":"%${adjustedSearch}%"}}`;
    //     if(searchDomElements.select.value == "weaponName") {
    //         adjustedSearch = `/weapon?q=${adjustedSearch}`;
    //     }
    //     else {
    //         adjustedSearch = `/armor?q=${adjustedSearch}`;
    //     }
    //     const armorNamePromise = getArmorByName(`${URL}${adjustedSearch}`)
    //         .then((armor) => {
    //             console.log(armor);
    //         });
    // }
    // else {

    // }
    try{
        //
        const responsePromise = await fetchWithTimeout((`${URL}/pokemon/ditto`), {timeout: 5000})
            .catch(e => {
              console.log(e);
            });
    
        if (responsePromise.status != 200){
    
          // stop loading screen
          domElements.loading.style.opacity = '0';
          console.log("status from api call: " + responsePromise.status);
          // show lack of results from completed call in the dom
          return null;
    
        } else {
          // the .json method parses the json into a JavaScript object
          const pokemon = await responsePromise.json();
          console.log(pokemon);
          return pokemon;
        }
    
      } catch (error){
        console.log(error);
      }
}

async function getArmorByName(search) {
    try {
        const res = await fetchFromResource(search)
                .catch(e => {
                    console.log(e.code);
                    return null;
                });
        if(res.status != 200) {
            console.log("status from api call " + res.status);
            return null;
        }

        const resArmor = await res.json();
        let armors = [];

        for(let i = 0; i < armors.length; i++) {
            createArmorResult(armors[i]);
        }
    }
    catch(error) {
        console.log(search);
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