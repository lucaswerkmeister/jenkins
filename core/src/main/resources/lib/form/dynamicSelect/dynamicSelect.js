window.addEventListener('load', function () {
  let dynamicDropdowns = document.querySelectorAll(".jenkins-dynamic-select")
  dynamicDropdowns.forEach(function (e) {
    let relatedDropdown = e.nextSibling.childNodes[0]
    e.addEventListener("click", e => {
      relatedDropdown.classList.add("jenkins-dynamic-select__items--visible")
    })
  })
})
