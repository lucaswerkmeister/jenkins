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
  var filter = searchBar.value.toLowerCase().trim();
  var filterParts = filter.split(/ +/).filter(function (word) {
    return word.length > 0;
  });
  var items = document.getElementsBySelector("TR.plugin").concat(document.getElementsBySelector("TR.unavailable"));

  for (var i = 0; i < items.length; i++) {
    if ((filterParts.length < 1 || filter.length < 2) && items[i].hasClassName("hidden-by-default")) {
      items[i].addClassName("jenkins-hidden");
      continue;
    }
    var makeVisible = true;

    var pluginId = items[i].getAttribute('data-plugin-id');
    var content = (items[i].querySelector('.details').innerText + " " + pluginId).toLowerCase();

    for (var j = 0; j < filterParts.length; j++) {
      var part = filterParts[j];
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
