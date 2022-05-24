import "regenerator-runtime/runtime";
import CommandPaletteService from "./services";
import {LinkResult} from "@/components/command-palette/models";
import * as Symbols from "./symbols";

window.addEventListener('load', () => {
  const i18n = document.getElementById("command-palette-i18n")
  const headerCommandPaletteButton = document.getElementById("button-open-command-palette");
  const commandPalette = document.getElementById("command-palette")
  const commandPaletteInput = document.getElementById("command-bar")
  const commandPaletteLoadingSymbol = commandPalette.querySelector(".jenkins-command-palette__search .icon")
  const searchResults = document.getElementById("search-results")
  const searchResultsContainer = document.getElementById("search-results-container")

  const hoverClass = "jenkins-command-palette__results__item--hover";

  // Events
  headerCommandPaletteButton.addEventListener("click", function () {
    if (commandPalette.hasAttribute("open")) {
      hideCommandCenter();
    } else {
      showCommandCenter();
    }
  });

  commandPalette.addEventListener("click", function (e) {
    if (e.target !== e.currentTarget) {
      return
    }

    hideCommandCenter();
  })

  commandPaletteInput.addEventListener("input", async (e) => {
    commandPaletteLoadingSymbol.classList.add("icon--loading")
    const query = e.target.value;
    let results;

    if (query.length === 0) {
      results = {
        [i18n.dataset.help]: [
          new LinkResult(
          {svg: Symbols.HELP},
          i18n.dataset.getHelp,
          undefined,
          undefined,
          document.getElementById("page-header").dataset.searchHelpUrl.escapeHTML(),
            true
          )
        ]
      }
    } else {
      results = await CommandPaletteService.getResults(query);
    }

    // Clear current search results
    searchResults.innerHTML = ""

    if (query.length === 0 || Object.keys(results).length > 0) {
      for (const [category, items] of Object.entries(results)) {
        const heading = document.createElement("p")
        heading.className = "jenkins-command-palette__results__heading"
        heading.innerText = category
        searchResults.append(heading)

        items.forEach(function (obj) {
          let link = document.createElement("DIV")
          link.innerHTML = obj.render();
          link = link.firstChild
          link.addEventListener("mouseenter", e => itemMouseEnter(e))
          searchResults.append(link)
        })
      }

      updateSelectedItem(0)
    } else {
      const label = document.createElement("p")
      label.className = "jenkins-command-palette__info"
      label.innerHTML = "<span>" + i18n.dataset.noResultsFor.escapeHTML() + "</span> " + e.target.value.escapeHTML()
      searchResults.append(label)
    }

    searchResultsContainer.style.height = searchResults.offsetHeight + "px"
    commandPaletteLoadingSymbol.classList.remove("icon--loading")
  })

  commandPaletteInput.addEventListener("keyup", function (event) {
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
    commandPalette.showModal();
    commandPaletteInput.focus();

    // Fire empty input event to command bar to set appropriate UI states (OOBE, results, no results)
    commandPaletteInput.dispatchEvent(new Event("input"));
  }

  function hideCommandCenter() {
    commandPalette.close();
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
