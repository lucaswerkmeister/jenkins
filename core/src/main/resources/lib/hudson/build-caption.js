(function () {
  function updateBuildCaptionIcon() {
    fetch("statusIcon").then((rsp) => {
      const cancelButton = document.querySelector("#button-cancel-build");

      var isBuilding = rsp.headers.get("X-Building") ?? 100;
      var anything = rsp.headers.get("X-anything") ?? 100;

      console.log(isBuilding)
      console.log(anything)

      const circlething = document.querySelector(".circlething");
      circlething.dataset.type = anything;
      circlething.dataset.complete = isBuilding === 100;

      const circlethingprogress = circlething.querySelector(".circlething_progress");
      circlethingprogress.style.setProperty("--pos", isBuilding + "%");

      if (isBuilding === 100) {
        if (cancelButton) {
          cancelButton.classList.add("closethingbutton--hidden")
        }

        return;
      }

      setTimeout(() => updateBuildCaptionIcon(), 4000);
    });
  }

  setTimeout(() => updateBuildCaptionIcon(), 4000);

  // window.addEventListener("load", function () {
  //   window.addEventListener("jenkins:consoleFinished", updateBuildCaptionIcon);
  // });
})();
