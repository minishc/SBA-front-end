window.onload = init;

const domElements = {
    collectDOM: function() {
        this.monsterSearch = document.getElementById("monster-search");
        this.equipmentSearch = document.getElementById("equipment-search");
    }
}

function init() {
    domElements.collectDOM();
    domElements.monsterSearch.addEventListener("mouseenter", changeColor);
    domElements.monsterSearch.addEventListener("mouseleave", originalColor);
    domElements.equipmentSearch.addEventListener("mouseenter", changeColor);
    domElements.equipmentSearch.addEventListener("mouseleave", originalColor);
}

function changeColor() {
    this.style.backgroundColor = "#84edb16e";
}

function originalColor() {
    this.style.backgroundColor = "#84edb14e";
}