"use strict";
window.onload = init;

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

function executeSearch() {
    let searchValue = searchDomElements.searchTerms.value.toLowerCase();
    
}