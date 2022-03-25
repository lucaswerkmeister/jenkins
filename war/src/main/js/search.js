import "core-js/stable"
import "regenerator-runtime/runtime"
import {generateKeyboardShortcutUI} from "./keyboard-shortcuts"

window.addEventListener('load', () => {
  const i18n = document.getElementById("command-center-i18n")
  const spotlightButton = document.getElementById("button-spotlight")
  const commandCenter = document.getElementById("command-center")
  const commandBarInput = document.getElementById("command-bar")
  const commandBarMagnifyingGlass = commandCenter.querySelector(".jenkins-command-center__search .icon")
  const searchResults = document.getElementById("search-results")
  const searchResultsContainer = document.getElementById("search-results-container")
  const commandBarKeyboardShortcut = document.getElementById("command-center-keyboard-shortcut")

  const hoverClass = "jenkins-command-center__results__item--hover"

// Update the keyboard shortcut text depending on OS
//   commandBarKeyboardShortcut.innerHTML = generateKeyboardShortcutUI("CMD+K")

// Events
  spotlightButton.addEventListener("click", function () {
    console.log("hello")

    if (commandCenter.open) {
      hideCommandCenter()
    } else {
      showCommandCenter()
    }
  })

  commandCenter.addEventListener("click", function (e) {
    if (e.target !== e.currentTarget) {
      return
    }

    hideCommandCenter()
  })

  commandBarInput.addEventListener("input", async (e) => {
    commandBarMagnifyingGlass.classList.add("icon--loading")
    let results

    if (e.target.value.length === 0) {
      results = {
        [i18n.dataset.help]: [
          {
            icon: {
              svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"ionicon\" viewBox=\"0 0 512 512\"><title>Help Circle</title><path d=\"M256 80a176 176 0 10176 176A176 176 0 00256 80z\" fill=\"none\" stroke=\"currentColor\" stroke-miterlimit=\"10\" stroke-width=\"32\"/><path d=\"M200 202.29s.84-17.5 19.57-32.57C230.68 160.77 244 158.18 256 158c10.93-.14 20.69 1.67 26.53 4.45 10 4.76 29.47 16.38 29.47 41.09 0 26-17 37.81-36.37 50.8S251 281.43 251 296\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"28\"/><circle cx=\"250\" cy=\"348\" r=\"20\" fill=\"currentColor\"/></svg>"
            },
            name: i18n.dataset.getHelp,
            url: document.getElementById("page-header").dataset.searchHelpUrl.escapeHTML()
          }
        ]
      }
    } else {
      let response = await fetch(document.getElementById("page-header").dataset.searchUrl.escapeHTML() + "?query=" + e.target.value)
      let result = await response.json()

      console.log(result)

      // Group the results
      results = groupByKey(result["suggestions"], "category")
    }

    // Clear current search results
    searchResults.innerHTML = ""

    if (e.target.value.length === 0 || Object.keys(results).length > 0) {
      for (const [category, items] of Object.entries(results)) {
        const heading = document.createElement("p")
        heading.className = "jenkins-command-center__results__heading"
        heading.innerText = category
        searchResults.append(heading)

        items.forEach(function (obj) {
          let link = document.createElement("DIV")
          link.innerHTML = `<a class="jenkins-command-center__results__item" href="${obj.url}">
                              <div class="jenkins-command-center__results__item__icon">${obj.icon ? `${obj.icon.svg ? obj.icon.svg : `<img src="${obj.icon.url}" alt="" />`}` : ``}</div>
                              ${obj.name}
                              ${obj.description ? `<span class="jenkins-command-center__results__item__description">${obj.description}</span>` : ``}
                              <svg class="jenkins-command-center__results__item__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144"/></svg>
                          </a>`
          link = link.firstChild
          link.addEventListener("mouseenter", e => itemMouseEnter(e))
          searchResults.append(link)
        })
      }

      updateSelectedItem(0)
    } else {
      const label = document.createElement("p")
      label.className = "jenkins-command-center__info"
      label.innerHTML = "<span>" + i18n.dataset.noResultsFor.escapeHTML() + "</span> " + e.target.value.escapeHTML()
      searchResults.append(label)
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
      case "Enter":
        if (hoveredItem) {
          window.location.href = hoveredItem.href
        }
        return false
      case "ArrowUp":
        if (selectedIndex !== -1) {
          if (selectedIndex - 1 < 0) {
            selectedIndex = maxLength - 1
          } else {
            selectedIndex--
          }

          updateSelectedItem(selectedIndex, selectedIndex + 1 >= maxLength)
        }
        return false
      case "ArrowDown":
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

// Helper methods for visibility of command center
  function showCommandCenter() {
    commandCenter.showModal()
    // commandCenter.style.display = "flex"
    // commandCenterBackdrop.style.display = "block"
    commandBarInput.focus()

    // Fire empty input event to command bar to set appropriate UI states (OOBE, results, no results)
    commandBarInput.dispatchEvent(new Event("input"))
  }

  function hideCommandCenter() {
    commandCenter.close()
    // commandCenter.style.display = "none"
    // commandCenterBackdrop.style.display = "none"
  }

// Group suggestions by 'category' field into map
  function groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if (obj[key] === undefined) return hash
        return Object.assign(hash, {[obj[key]]: (hash[obj[key]] || []).concat(obj)})
      }, {})
  }

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
})
