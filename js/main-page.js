window.onload = init;
//grabbing the DOM elements to add event listeners to
const domElements = {
    collectDOM: function() {
        this.monsterSearch = document.getElementById("monster-search");
        this.equipmentSearch = document.getElementById("equipment-search");
        this.guessMonster = document.getElementById("guess-monster")
    }
}

function init() {
    domElements.collectDOM();
    domElements.monsterSearch.addEventListener("mouseenter", changeColor);
    domElements.monsterSearch.addEventListener("mouseleave", originalColor);
    domElements.equipmentSearch.addEventListener("mouseenter", changeColor);
    domElements.equipmentSearch.addEventListener("mouseleave", originalColor);
    domElements.guessMonster.addEventListener("mouseenter", changeColor);
    domElements.guessMonster.addEventListener("mouseleave", originalColor);
}

function changeColor() {
    this.style.backgroundColor = "#bcc3bf2e";
}

function originalColor() {
    this.style.backgroundColor = "#bcc3bf4e";
}