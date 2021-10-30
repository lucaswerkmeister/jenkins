import "core-js/stable";
import "regenerator-runtime/runtime";
import hotkeys from 'hotkeys-js';

const spotlightButton = document.getElementById("button-spotlight");
const commandCentreBackdrop = document.getElementById("command-centre-backdrop");
const commandCentre = document.getElementById("command-centre");
const commandBarInput = document.getElementById("command-bar");
const searchResults = document.getElementById("search-results");

commandCentreBackdrop.addEventListener("click", function() {
    hideCommandCentre()
})

spotlightButton.addEventListener("click", function() {
    showCommandCentre()
})

// Returning false stops the event and prevents default browser events
// Mac OS system defines `command + r` as a refresh shortcut
hotkeys('ctrl+k, command+k', async function() {
    showCommandCentre();
    return false;
});

function showCommandCentre() {
    commandCentre.style.display = "flex"
    commandCentreBackdrop.style.display = "block"
    commandBarInput.focus()
}

function hideCommandCentre() {
    commandCentre.style.display = "none"
    commandCentreBackdrop.style.display = "none"
}

commandBarInput.addEventListener('input', async function (e) {
    let response = await fetch('http://localhost:8080/jenkins/search/suggest?query=' + e.target.value);
    let result = await response.json();

    // Clear current search results
    searchResults.innerHTML = '';

    console.log(result["suggestions"])

    result["suggestions"].forEach(function(obj) {
        console.log(obj.name);

        var div = document.createElement('DIV');
        div.innerHTML = `<a class="jenkins-command-centre__results__item" href="${obj.url}">
                            <div class="jenkins-command-centre__results__item__icon">${obj.icon ? `${obj.icon.svg ? obj.icon.svg : `<img src="${obj.icon.url}" alt="" />`}` : ``}</div>
                            ${obj.name} 
                            ${obj.description ? `<span class="jenkins-command-centre__results__item__description">${obj.description}</span>` : ''}
                        </a>`;
        searchResults.append(div.firstChild)

    });
});
