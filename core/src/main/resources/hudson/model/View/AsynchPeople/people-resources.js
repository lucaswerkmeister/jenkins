function display(data) {
    var p = document.getElementById('people');
    p.show();
    var rootURL = document.head.getAttribute('data-rooturl');
    for (var x = 0; data.length > x; x++) {
        var e = data[x];
        var id = 'person-' + e.id;
        var r = document.getElementById(id);
        if (r == null) {
            r = document.createElement('tr');
            r.id = id;
            p.appendChild(r);
        } else {
            while (r.firstChild) {
                r.removeChild(r.firstChild);
            }
        }

        var d = document.createElement('td');
        var wrapper = document.createElement('div');
        wrapper.className = 'jenkins-table__cell__button-wrapper';
        d.className = 'jenkins-table__cell--tight jenkins-table__icon';

        var icon = document.createElement("div")
        icon.className = "jenkins-user-avatar"

        const iconBackplate = document.createElement("div")
        iconBackplate.className = "jenkins-user-avatar__backplate"
        iconBackplate.style.background = `linear-gradient(${e.icon.angle}deg, var(--${e.icon.primaryColor}), var(--${e.icon.secondaryColor}))`;
        icon.appendChild(iconBackplate)

        const iconInitials = document.createElement("p")
        iconInitials.className = "jenkins-user-avatar__initials"
        iconInitials.style.background = `linear-gradient(${e.icon.angle}deg, var(--${e.icon.primaryColor}), var(--${e.icon.secondaryColor}))`;
        iconInitials.style.setProperty("-webkit-background-clip", "text")
        iconInitials.textContent = e.icon.initials;
        icon.appendChild(iconInitials)

        wrapper.appendChild(icon)
        d.appendChild(wrapper);
        r.appendChild(d);

        d = document.createElement('td');
        var a = document.createElement('a');
        a.href = rootURL + "/" + e.url;
        a.className = "jenkins-table__link"
        a.appendChild(document.createTextNode(e.id));
        d.appendChild(a);
        r.appendChild(d);

        d = document.createElement('td');
        d.appendChild(document.createTextNode(e.fullName));
        r.appendChild(d);

        d = document.createElement('td');
        d.setAttribute('data', e.timeSortKey);
        d.appendChild(document.createTextNode(e.lastChangeTimeString));
        r.appendChild(d);

        d = document.createElement('td');
        if (e.projectUrl != null) {
            a = document.createElement('a');
            a.href = rootURL + "/" + e.projectUrl;
            a.className = 'jenkins-table__link model-link inside';
            a.appendChild(document.createTextNode(e.projectFullDisplayName));
            d.appendChild(a);
        }
        r.appendChild(d);

        ts_refresh(p);
    }
}
