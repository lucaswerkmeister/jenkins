function init() {
  Behaviour.specify(
    ".jenkins-help-button",
    "a-jenkins-help-button",
    1000,
    function (e) {
      e.onclick = helpButtonOnClick;
    }
  );

  // legacy class name
  Behaviour.specify("A.help-button", "a-help-button", 1000, function (e) {
    e.onclick = helpButtonOnClick;
  });
}

function helpButtonOnClick() {
  const parent = this.closest(".jenkins-form-item");
  const helpArea = parent.querySelector(".help-area .help");

  if (helpArea.style.display === "flex") {
    helpArea.style.display = "none";
    layoutUpdateCallback.call();
    return false;
  }

  helpArea.style.display = "flex";

  // Skip loading the content if it's already been loaded
  if (helpArea.dataset.loaded === "true") {
    return;
  }

  fetch(this.getAttribute("helpURL")).then((rsp) => {
    rsp.text().then((responseText) => {
      if (rsp.ok) {
        const from = rsp.headers.get("X-Plugin-From");
        // Which plugin is this from?
        helpArea.innerHTML =
          responseText +
          (from ? "<div class='from-plugin'>" + from + "</div>" : "");

        // Ensure links open in new window unless explicitly specified otherwise
        const links = helpArea.getElementsByTagName("a");
        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          if (link.hasAttribute("href")) {
            // ignore document anchors
            if (!link.hasAttribute("target")) {
              link.setAttribute("target", "_blank");
            }
            if (!link.hasAttribute("rel")) {
              link.setAttribute("rel", "noopener noreferrer");
            }
          }
        }
      } else {
        helpArea.innerHTML =
          "<b>ERROR</b>: Failed to load help file: " + rsp.statusText;
      }

      helpArea.dataset.loaded = "true";
      layoutUpdateCallback.call();
    });
  });

  return false;
}

export default { init };
