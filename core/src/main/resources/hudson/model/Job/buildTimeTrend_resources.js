/**
 * Public method to be called by progressiveRendering's callback
 */
window.buildTimeTrend_displayBuilds = function (data) {
  var p = document.getElementById("trend");
  var isDistributedBuildsEnabled =
    "true" === p.getAttribute("data-is-distributed-build-enabled");
  var rootURL = document.head.getAttribute("data-rooturl");

  for (var x = 0; data.length > x; x++) {
    var e = data[x];
    var tr = new Element("tr");
    tr.insert(
      new Element("td", { data: e.iconColorOrdinal }).insert(
        new Element("a", {
          class: "build-status-link",
          href: e.number + "/console",
          tooltip: e.iconColorDescription,
        }).insert(generateSVGIcon(e.iconName))
      )
    );
    tr.insert(
      new Element("td", { data: e.number }).insert(
        new Element("a", {
          href: e.number + "/",
          class: "model-link inside",
        }).update(e.displayName.escapeHTML())
      )
    );
    tr.insert(
      new Element("td", { data: e.duration }).update(
        e.durationString.escapeHTML()
      )
    );
    if (isDistributedBuildsEnabled) {
      var buildInfo = null;
      var buildInfoStr = (e.builtOnStr || "").escapeHTML();
      if (e.builtOn) {
        buildInfo = new Element("a", {
          href: rootURL + "/computer/" + e.builtOn,
          class: "model-link inside",
        }).update(buildInfoStr);
      } else {
        buildInfo = buildInfoStr;
      }
      tr.insert(new Element("td").update(buildInfo));
    }
    p.insert(tr);
    Behaviour.applySubtree(tr);
  }
  ts_refresh(p);
};

function i18n(content) {
  return document.querySelector("#i18n").getAttribute(`data-${content}`);
}

function generateSVGIcon(iconName) {
  const icons = document.querySelector("#icons");
  iconName = iconName.replace("-anime", "");

  return icons.content.querySelector(`#${iconName}`).outerHTML;
}
