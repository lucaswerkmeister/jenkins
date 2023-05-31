package jenkins.model.navigation;

public class SettingsNavigationItem implements NavigationItem {

    @Override
    public String getDisplayName() {
        return "Settings";
    }

    @Override
    public String getIcon() {
        return "symbol-settings";
    }

    @Override
    public String getUrl() {
        return "manage";
    }
}
