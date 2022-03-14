import $ from "jquery";

window.addEventListener("load", function () {
  const form = document.querySelector('#createItem')
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

  // TODO - Remove otherwise submission doesn't work!
  function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.target)
    console.log(Object.fromEntries(data.entries()))

    $.get("checkJobName", { value: "   " }).done(function(data) {
      console.log(data)
    });
  }

  form.addEventListener('submit', handleSubmit)
})
