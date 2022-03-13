window.addEventListener("load", function () {
  const toggleButtons = document.querySelectorAll("#button-project-type, #button-clone")
  const paneProjectType = document.querySelector("#pane-project-type")
  const paneClone = document.querySelector("#pane-clone")

  toggleButtons.forEach(button => {
    button.addEventListener("click", function() {
      paneProjectType.classList.toggle("jenkins-hidden")
      paneClone.classList.toggle("jenkins-hidden")
    })
  })
})
