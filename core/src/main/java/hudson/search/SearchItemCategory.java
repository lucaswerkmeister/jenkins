package hudson.search;

import org.jenkins.ui.icon.Icon;

public enum SearchItemCategory {
    PAGES("Pages", "symbol-details"),
    SETTINGS("Settings", "symbol-settings"),
    VIEWS("Views", "symbol-settings"),
    JOBS("Jobs", "symbol-reload"),
    BUILDS("Builds", "symbol-settings"),
    PEOPLE("People", "symbol-person"),
    NODES("Nodes", "symbol-computer"),
    OTHER("Other", "symbol-cube");

    private final String name;
    private final Icon icon;

    SearchItemCategory(String name, String iconSource) {
        this.name = name;
        this.icon = new Icon(iconSource, "");
    }

    public String getName() {
        return name;
    }

    public Icon getIcon() {
        return icon;
    }
}
