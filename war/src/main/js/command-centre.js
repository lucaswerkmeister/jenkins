import "core-js/stable"
import "regenerator-runtime/runtime"
import hotkeys from 'hotkeys-js'

const i18n = document.getElementById("command-center-i18n")
const spotlightButton = document.getElementById("button-spotlight")
const commandCentreBackdrop = document.getElementById("command-centre-backdrop")
const commandCentre = document.getElementById("command-centre")
const commandBarInput = document.getElementById("command-bar")
const commandBarMagnifyingGlass = commandCentre.querySelector(".jenkins-command-centre__search .icon")
const searchResults = document.getElementById("search-results")
const searchResultsContainer = document.getElementById("search-results-container")
const keyboardModifier = document.getElementById("command-centre-shortcut-modifier")

const hoverClass = "jenkins-command-centre__results__item--hover"

// Update the keyboard shortcut text depending on OS
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
keyboardModifier.textContent = isMac ? "⌘" : "CTRL"

spotlightButton.addEventListener("click", function () {
  showCommandCentre()
})

commandCentre.addEventListener("click", function (e) {
  if (e.target !== e.currentTarget) {
    return
  }

  hideCommandCentre()
})

hotkeys('ctrl+k, command+k', async function () {
  showCommandCentre()
  // Returning false stops the event and prevents default browser events
  return false
})

function showCommandCentre() {
  commandCentre.style.display = "flex"
  commandCentreBackdrop.style.display = "block"
  commandBarInput.focus()

  // Fire empty input event to command bar to set appropriate UI states (OOBE, results, no results)
  commandBarInput.dispatchEvent(new Event('input'))
}

function hideCommandCentre() {
  commandCentre.style.display = "none"
  commandCentreBackdrop.style.display = "none"
}

function groupByKey(array, key) {
  return array
    .reduce((hash, obj) => {
      if (obj[key] === undefined) return hash
      return Object.assign(hash, {[obj[key]]: (hash[obj[key]] || []).concat(obj)})
    }, {})
}

commandBarInput.addEventListener('input', async function (e) {
  commandBarMagnifyingGlass.classList.add("icon--loading")

  if (e.target.value.length === 0) {
    generateOobe()
  } else {
    let response = await fetch(document.getElementById("header").dataset.searchUrl.escapeHTML() + '?query=' + e.target.value)
    let result = await response.json()

    // Clear current search results
    searchResults.innerHTML = ''

    if (result["suggestions"].length > 0) {
      // Group the suggestions
      const groupedSuggestions = groupByKey(result["suggestions"], "group")

      for (const [group, items] of Object.entries(groupedSuggestions)) {
        const heading = document.createElement('p')
        heading.className = "jenkins-command-centre__results__heading"
        heading.innerText = group
        searchResults.append(heading)

        items.forEach(function (obj) {
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
    } else {
      const heading = document.createElement('p')
      heading.className = "jenkins-command-centre__info"
      heading.innerHTML = "<span>" + i18n.dataset.noResultsFor.escapeHTML() + "</span> " + e.target.value.escapeHTML()
      searchResults.append(heading)
    }
  }

  searchResultsContainer.style.height = searchResults.offsetHeight + "px"
  commandBarMagnifyingGlass.classList.remove("icon--loading")
})

commandBarInput.addEventListener("keyup", function (event) {
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
          selectedIndex--
        }

        updateSelectedItem(selectedIndex, selectedIndex + 1 >= maxLength)
      }
      return false
    case 'ArrowDown':
      if (selectedIndex !== -1) {
        if (selectedIndex + 1 >= maxLength) {
          selectedIndex = 0
        } else {
          selectedIndex++
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
      element.scrollIntoView()
    }
  }
}

function generateOobe() {
  // Clear current search results
  searchResults.innerHTML = ''

  const groupedSuggestions = {
    "Featured": [
      {
        icon: {
          svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"ionicon\" viewBox=\"0 0 512 512\"><title>Help Circle</title><path d=\"M256 80a176 176 0 10176 176A176 176 0 00256 80z\" fill=\"none\" stroke=\"currentColor\" stroke-miterlimit=\"10\" stroke-width=\"32\"/><path d=\"M200 202.29s.84-17.5 19.57-32.57C230.68 160.77 244 158.18 256 158c10.93-.14 20.69 1.67 26.53 4.45 10 4.76 29.47 16.38 29.47 41.09 0 26-17 37.81-36.37 50.8S251 281.43 251 296\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"28\"/><circle cx=\"250\" cy=\"348\" r=\"20\" fill=\"currentColor\"/></svg>"
        },
        name: "Get help using Jenkins search",
        url: document.getElementById("header").dataset.searchHelpUrl.escapeHTML()
      },
      {
        icon: {
          svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"ionicon\" viewBox=\"0 0 512 512\"><title>Help Circle</title><path d=\"M256 80a176 176 0 10176 176A176 176 0 00256 80z\" fill=\"none\" stroke=\"currentColor\" stroke-miterlimit=\"10\" stroke-width=\"32\"/><path d=\"M200 202.29s.84-17.5 19.57-32.57C230.68 160.77 244 158.18 256 158c10.93-.14 20.69 1.67 26.53 4.45 10 4.76 29.47 16.38 29.47 41.09 0 26-17 37.81-36.37 50.8S251 281.43 251 296\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"28\"/><circle cx=\"250\" cy=\"348\" r=\"20\" fill=\"currentColor\"/></svg>"
        },
        name: "Get help using Jenkins search",
        url: document.getElementById("header").dataset.searchHelpUrl.escapeHTML()
      },
      {
        icon: {
          svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"ionicon\" viewBox=\"0 0 512 512\"><title>Help Circle</title><path d=\"M256 80a176 176 0 10176 176A176 176 0 00256 80z\" fill=\"none\" stroke=\"currentColor\" stroke-miterlimit=\"10\" stroke-width=\"32\"/><path d=\"M200 202.29s.84-17.5 19.57-32.57C230.68 160.77 244 158.18 256 158c10.93-.14 20.69 1.67 26.53 4.45 10 4.76 29.47 16.38 29.47 41.09 0 26-17 37.81-36.37 50.8S251 281.43 251 296\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"28\"/><circle cx=\"250\" cy=\"348\" r=\"20\" fill=\"currentColor\"/></svg>"
        },
        name: "Get help using Jenkins search",
        url: document.getElementById("header").dataset.searchHelpUrl.escapeHTML()
      },
      {
        icon: {
          svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"ionicon\" viewBox=\"0 0 512 512\"><title>Help Circle</title><path d=\"M256 80a176 176 0 10176 176A176 176 0 00256 80z\" fill=\"none\" stroke=\"currentColor\" stroke-miterlimit=\"10\" stroke-width=\"32\"/><path d=\"M200 202.29s.84-17.5 19.57-32.57C230.68 160.77 244 158.18 256 158c10.93-.14 20.69 1.67 26.53 4.45 10 4.76 29.47 16.38 29.47 41.09 0 26-17 37.81-36.37 50.8S251 281.43 251 296\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"28\"/><circle cx=\"250\" cy=\"348\" r=\"20\" fill=\"currentColor\"/></svg>"
        },
        name: i18n.dataset.getHelp,
        url: document.getElementById("header").dataset.searchHelpUrl.escapeHTML()
      }
    ]
  }

  for (const [group, items] of Object.entries(groupedSuggestions)) {
    const heading = document.createElement('p')
    heading.className = "jenkins-command-centre__results__heading"
    heading.innerText = group
    searchResults.append(heading)

    items.forEach(function (obj) {
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
}
