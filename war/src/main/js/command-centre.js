import "core-js/stable";
import "regenerator-runtime/runtime";
import hotkeys from 'hotkeys-js';

const commandCentreBackdrop = document.getElementById("command-centre-backdrop");
const commandCentre = document.getElementById("command-centre");
const commandBarInput = document.getElementById("command-bar");
const searchResults = document.getElementById("search-results");

commandCentreBackdrop.addEventListener("click", function() {
    hideCommandCentre()
})

// Returning false stops the event and prevents default browser events
// Mac OS system defines `command + r` as a refresh shortcut
hotkeys('ctrl+k, command+k', async function() {
    await showCommandCentre();
    return false;
});

async function showCommandCentre() {
    commandCentre.style.visibility = "visible"
    commandCentreBackdrop.style.visibility = "visible"
    await new Promise(resolve => setTimeout(resolve, 75));
    commandBarInput.focus()
}

function hideCommandCentre() {
    commandCentreBackdrop.style.visibility = "hidden"
    commandCentre.style.visibility = "hidden"
}

commandBarInput.addEventListener('input', async function (e) {
    let response = await fetch('http://localhost:8080/jenkins/search/suggest?query=' + e.target.value);
    let result = await response.json();

    // Clear current search results
    searchResults.innerHTML = '';

    result["suggestions"].forEach(function(obj) {
        console.log(obj.name);

        var div = document.createElement('DIV');
        div.innerHTML = `<a href="${obj.url}">
                            <div>${obj.icon.svg}</div>
                            ${obj.name} 
                            ${obj.description ? `<span class="jenkins-command-centre__item__description">${obj.description}</span>` : ''}
                        </a>`;
        searchResults.append(div.firstChild)

    });
});
