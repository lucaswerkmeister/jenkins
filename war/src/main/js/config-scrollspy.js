import $ from 'jquery'
import page from './util/page'

// Some stuff useful for testing.
export var scrollspeed = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 350

// Used to set scrollspeed from the the test suite
export function setScrollspeed(newScrollspeed) {
    scrollspeed = newScrollspeed
}

$(function() {
  const sideNav = document.querySelector(".jenkins-side-nav")
  const headers = document.querySelectorAll("h2, .config-table > .jenkins-section > .jenkins-section__title")

  headers.forEach(function(header, i) {
    const textContent = header.textContent.replaceAll(" ", "")
    header.id = textContent

    let item = document.createElement("button")
    item.className = "jenkins-side-nav__item"
    item.innerHTML = header.textContent
    item.setAttribute("section-id", textContent)
    item.addEventListener("click", function (e) {
      const headerToGoTo = document.querySelector("#" + textContent)
      scrollTo(i === 0 ? 0 : (headerToGoTo.getBoundingClientRect().top + window.scrollY) - 40 - 30)
    })
    sideNav.appendChild(item)
  })

  page.onWinScroll(function () {
    autoActivateTabs()
  })

  autoActivateTabs()
})

function scrollTo(yPosition) {
  $('html,body').animate({
    scrollTop: yPosition
  }, scrollspeed)
}

/**
 * Watch page scrolling, changing the active tab as needed
 */
function autoActivateTabs() {
  const winScrollTop = Math.max(page.winScrollTop(), 0)
  const sections = document.querySelectorAll("h2, .config-table > .jenkins-section > .jenkins-section__title")

  let selectedSection = null

  // calculate the top and height of each section to know where to switch the tabs...
  sections.forEach(function (section, i) {
    const previousSection = i === 1 ? document.querySelector(".jenkins-section:first-of-type") : sections[Math.max(i - 1, 0)].parentNode
    const viewportEntryOffset = i === 0 ? 0 : ((section.parentNode.getBoundingClientRect().top + window.scrollY) - (previousSection.offsetHeight / 2))

    if (winScrollTop >= viewportEntryOffset) {
      selectedSection = section
    }
  })

  document.querySelectorAll(".jenkins-side-nav__item--selected").forEach(function(selected) {
    selected.classList.remove("jenkins-side-nav__item--selected")
  })

  document.querySelector(".jenkins-side-nav__item[section-id='" + selectedSection.id + "']").classList.add("jenkins-side-nav__item--selected")
}
