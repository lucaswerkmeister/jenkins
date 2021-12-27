import "core-js/stable"
import "regenerator-runtime/runtime"
import hotkeys from 'hotkeys-js'

const spotlightButton = document.getElementById("button-spotlight")
const commandCentreBackdrop = document.getElementById("command-centre-backdrop")
const commandCentre = document.getElementById("command-centre")
const commandBarInput = document.getElementById("command-bar")
const searchResults = document.getElementById("search-results")
const searchResultsContainer = document.getElementById("search-results-container")
const keyboardModifier = document.getElementById("command-centre-shortcut-modifier")

const hoverClass = "jenkins-command-centre__results__item--hover"

// Update the keyboard shortcut text depending on OS
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
keyboardModifier.textContent = isMac ? "⌘" : "CTRL"

spotlightButton.addEventListener("click", function() {
    showCommandCentre()
})

commandCentre.addEventListener("click", function(e) {
  if (e.target !== e.currentTarget) {
    return;
  }

  hideCommandCentre()
})

hotkeys('ctrl+k, command+k', async function() {
    showCommandCentre()
    // Returning false stops the event and prevents default browser events
    return false
})

function showCommandCentre() {
    commandCentre.style.display = "flex"
    commandCentreBackdrop.style.display = "block"
    commandBarInput.focus()
}

function hideCommandCentre() {
    commandCentre.style.display = "none"
    commandCentreBackdrop.style.display = "none"
}

function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if(obj[key] === undefined) return hash
            return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
        }, {})
}

commandBarInput.addEventListener('input', async function (e) {
    let response = await fetch('http://localhost:8080/jenkins/search/suggest?query=' + e.target.value)
    let result = await response.json()

    // Clear current search results
    searchResults.innerHTML = ''

    // Group the suggestions
    const groupedSuggestions = groupByKey(result["suggestions"], "group")

    for (const [group, items] of Object.entries(groupedSuggestions)) {
        const heading = document.createElement('p')
        heading.className = "jenkins-command-centre__results__heading"
        heading.innerText = group
        searchResults.append(heading)

        items.forEach(function(obj) {
            let link = document.createElement('DIV')
            link.innerHTML = `<a class="jenkins-command-centre__results__item" href="${obj.url}">
                            <div class="jenkins-command-centre__results__item__icon">${obj.icon ? `${obj.icon.svg ? obj.icon.svg : `<img src="${obj.icon.url}" alt="" />`}` : ``}</div>
                            ${obj.name}
                            ${obj.description ? `<span class="jenkins-command-centre__results__item__description">${obj.description}</span>` : ''}
                            <svg class="jenkins-command-centre__results__item__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144"/></svg>
                        </a>`
            link = link.firstChild
            link.addEventListener("mouseenter", e => itemMouseEnter(e))
            searchResults.append(link)
        })
    }

    updateSelectedItem(0)

    searchResultsContainer.style.height = searchResults.offsetHeight + "px"
})

commandBarInput.addEventListener("keyup", function(event) {
    const maxLength = searchResults.getElementsByTagName("a").length
    let selectedIndex = -1
    let hoveredItem = document.querySelector("." + hoverClass)

    if (hoveredItem) {
        selectedIndex = [...hoveredItem.parentElement.getElementsByTagName("a")].indexOf(hoveredItem)
    }

    switch (event.code) {
        case 'Enter':
            if (hoveredItem) {
                window.location.href = hoveredItem.href
            }
            return false
        case 'ArrowUp':
            if (selectedIndex !== -1) {
                if (selectedIndex - 1 < 0) {
                    selectedIndex = maxLength - 1
                } else {
                    selectedIndex --
                }

                updateSelectedItem(selectedIndex, selectedIndex + 1 >= maxLength)
            }
            return false
        case 'ArrowDown':
            if (selectedIndex !== -1) {
                if (selectedIndex + 1 >= maxLength) {
                    selectedIndex = 0
                } else {
                    selectedIndex ++
                }

                updateSelectedItem(selectedIndex, selectedIndex + 1 >= maxLength)
            }
            return false
    }
})

function itemMouseEnter(item) {
    let hoveredItems = document.querySelector("." + hoverClass)
    if (hoveredItems) {
        hoveredItems.classList.remove(hoverClass)
    }

    item.target.classList.add(hoverClass)
}

function updateSelectedItem(index, scrollIntoView = false) {
    const maxLength = searchResults.getElementsByTagName("a").length
    const hoveredItem = document.querySelector("." + hoverClass)

    if (hoveredItem) {
        hoveredItem.classList.remove(hoverClass)
    }

    if (index < maxLength) {
       const element = [...searchResults.getElementsByTagName("a")][index]
        element.classList.add(hoverClass)

        if (scrollIntoView) {
            element.scrollIntoView();
        }
    }
}
