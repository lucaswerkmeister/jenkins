const selectCompatiblePlugins = document.querySelector("#link-select-compatible-plugins");
const searchBar = document.querySelector("#filter-box");

selectCompatiblePlugins.addEventListener("click", () => {
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    if (input.type === "checkbox") {
      input.checked = input.dataset.compatWarning === "false";
    }
  });
});

searchBar.addEventListener("input", () => {
  const filter = searchBar.value.toLowerCase().trim();
  const filterParts = filter.split(/ +/).filter(function (word) {
    return word.length > 0;
  });
  const items = document.getElementsBySelector("TR.plugin").concat(document.getElementsBySelector("TR.unavailable"));

  for (let i = 0; i < items.length; i++) {
    if ((filterParts.length < 1 || filter.length < 2) && items[i].hasClassName("hidden-by-default")) {
      items[i].addClassName("jenkins-hidden");
      continue;
    }
    let makeVisible = true;

    const pluginId = items[i].getAttribute("data-plugin-id");
    const content = (items[i].querySelector(".details").innerText + " " + pluginId).toLowerCase();

    for (let j = 0; j < filterParts.length; j++) {
      const part = filterParts[j];
      if (content.indexOf(part) < 0) {
        makeVisible = false;
        break;
      }
    }

    if (makeVisible) {
      items[i].classList.remove("jenkins-hidden");
    } else {
      items[i].classList.add("jenkins-hidden");
    }
  }
});
