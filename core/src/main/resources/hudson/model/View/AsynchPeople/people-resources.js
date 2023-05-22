window.display = function (data) {
  var p = document.getElementById("people");
  p.style.display = "";
  var rootURL = document.head.getAttribute("data-rooturl");
  for (var x = 0; data.length > x; x++) {
    var e = data[x];
    var id = "person-" + e.id;
    var r = document.getElementById(id);
    if (r == null) {
      r = document.createElement("tr");
      r.id = id;
      p.appendChild(r);
    } else {
      while (r.firstChild) {
        r.removeChild(r.firstChild);
      }
    }

    var d = document.createElement("td");
    var wrapper = document.createElement("div");
    wrapper.className = "jenkins-table__cell__button-wrapper";
    d.className = "jenkins-table__cell--tight jenkins-table__icon";
    const icon = document.createElement("div");
    icon.className = "jenkins-avatar";
    icon.dataset.fullname = e.fullName;
    const iconInitials = document.createElement("span");
    iconInitials.className = "jenkins-avatar__initials";
    icon.appendChild(iconInitials);

    wrapper.innerHTML = icon.outerHTML;
    d.appendChild(wrapper);
    r.appendChild(d);

    d = document.createElement("td");
    var a = document.createElement("a");
    a.href = rootURL + "/" + e.url;
    a.className = "jenkins-table__link";
    a.appendChild(document.createTextNode(e.id));
    d.appendChild(a);
    r.appendChild(d);

    d = document.createElement("td");
    d.appendChild(document.createTextNode(e.fullName));
    r.appendChild(d);

    d = document.createElement("td");
    d.setAttribute("data", e.timeSortKey);
    d.appendChild(document.createTextNode(e.lastChangeTimeString));
    r.appendChild(d);

    d = document.createElement("td");
    if (e.projectUrl != null) {
      a = document.createElement("a");
      a.href = rootURL + "/" + e.projectUrl;
      a.className = "jenkins-table__link model-link inside";
      a.appendChild(document.createTextNode(e.projectFullDisplayName));
      d.appendChild(a);
    }
    r.appendChild(d);

    Behaviour.applySubtree(r);

    ts_refresh(p);
  }
};
