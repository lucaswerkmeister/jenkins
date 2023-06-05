package jenkins.model.navigation;

public class ThemeManagerNavigationItem implements NavigationItem {

    @Override
    public String getDisplayName() {
        return "Switch theme";
    }

    @Override
    public String getIcon() {
        return "symbol-theme-manager";
    }

    @Override
    public String getUrl() {
        return null;
    }
}
