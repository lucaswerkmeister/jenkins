window.addEventListener("load", function () {
  let dynamicDropdowns = document.querySelectorAll(".jenkins-dynamic-select")
  dynamicDropdowns.forEach(function (e) {
    let relatedDropdown = e.nextSibling.childNodes[0]

    // Show and hide the dropdown
    e.addEventListener("click", e => {
      relatedDropdown.classList.toggle("jenkins-dynamic-select__items--visible")
    })

    relatedDropdown.querySelectorAll("input[type='radio']").forEach(function(radio) {
      radio.addEventListener("change", function() {
        e.innerHTML = radio.nextSibling.innerHTML
        relatedDropdown.classList.remove("jenkins-dynamic-select__items--visible")
      })
    })
  })
})
