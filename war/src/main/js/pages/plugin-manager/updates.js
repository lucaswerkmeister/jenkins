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

  for (const item of items) {
    if ((filterParts.length < 1 || filter.length < 2) && item.hasClassName("hidden-by-default")) {
      item.addClassName("jenkins-hidden");
      continue;
    }

    const pluginId = item.getAttribute("data-plugin-id");
    const content = (item.querySelector(".details").innerText + " " + pluginId).toLowerCase();
    const hideItem = !filterParts.every(part => content.includes(part));

    item.classList.toggle("jenkins-hidden", hideItem);
  }
});
