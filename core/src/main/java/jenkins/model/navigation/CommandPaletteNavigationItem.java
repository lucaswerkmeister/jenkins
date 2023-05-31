package jenkins.model.navigation;

public class CommandPaletteNavigationItem implements NavigationItem {

    @Override
    public String getDisplayName() {
        return "Search";
    }

    @Override
    public String getIcon() {
        return "symbol-search";
    }

    @Override
    public String getUrl() {
        return "";
    }
}
