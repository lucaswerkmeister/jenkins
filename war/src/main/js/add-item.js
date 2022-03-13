window.addEventListener("load", function () {
  const toggleButtons = document.querySelectorAll("#button-project-type, #button-clone")
  const paneProjectType = document.querySelector("#pane-project-type")
  const paneClone = document.querySelector("#pane-clone")
  const paneProjectTypeInputs = paneProjectType.querySelectorAll("input")
  const paneCloneInputs = paneClone.querySelectorAll("input")

  toggleButtons.forEach(button => {
    button.addEventListener("click", function() {
      paneProjectType.classList.toggle("jenkins-hidden")
      paneClone.classList.toggle("jenkins-hidden")

      // Invert the disabled state of each input so that the disabled inputs are not submitted
      paneProjectTypeInputs.forEach(e => e.toggleAttribute("disabled"))
      paneCloneInputs.forEach(e => e.toggleAttribute("disabled"))
    })
  })

  // TODO - Remove otherwise submission doesn't work!
  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log(Object.fromEntries(data.entries()));
  }

  const form = document.querySelector('#createItem');
  form.addEventListener('submit', handleSubmit);
})
