window.addEventListener("load", function () {
  const form = document.querySelector("#createItem")
  const toggleButtons = document.querySelectorAll("#button-project-type, #button-clone")
  const paneProjectType = document.querySelector("#pane-project-type")
  const paneClone = document.querySelector("#pane-clone")
  const paneProjectTypeInputs = paneProjectType.querySelectorAll("input")
  const paneCloneInputs = paneClone.querySelectorAll("input")

  toggleButtons.forEach(button => {
    button.addEventListener("click", function() {
      paneProjectType.classList.toggle("app-banana")
      paneClone.classList.toggle("app-banana")

      // Invert the disabled state of each input so that the disabled inputs are not submitted
      paneProjectTypeInputs.forEach(e => e.toggleAttribute("disabled"))
      paneCloneInputs.forEach(e => e.toggleAttribute("disabled"))
    })
  })

  document.querySelectorAll("input").forEach(function(input) {
    input.addEventListener("change", function() {
      validateFormItems(input.name)
    })
  })

  /**
   * @param {string|undefined} fieldName - Only validate this field if provided, otherwise validate all fields
   */
  function validateFormItems(fieldName) {
    const data = Object.fromEntries(new FormData(form).entries())

    const validationNameError = document.querySelector("#validation-name-error")
    const validationProjectTypeError = document.querySelector("#validation-project-type-error")
    const validationCloneError = document.querySelector("#validation-clone-error")

    if (fieldName === "name" || !fieldName) {
      validationNameError.classList.toggle("jenkins-hidden", data.name.trim().length !== 0)
    }
    if (fieldName === "mode" || !fieldName) {
      validationProjectTypeError.classList.toggle("jenkins-hidden", "mode" in data && data.mode !== "copy")
    }
    if (fieldName === "from" || !fieldName) {
      validationCloneError.classList.toggle("jenkins-hidden", data.mode === "copy" && "from" in data)
    }

    return [...document.querySelectorAll(".error")].every(e => e.offsetParent === null)
  }

  form.addEventListener("submit", function(event) {
    if (!validateFormItems(undefined)) {
      event.preventDefault()
    }
  })
})
