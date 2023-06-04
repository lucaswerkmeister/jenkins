package jenkins.model.navigation;

import jenkins.management.Badge;

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

    @Override
    public Badge getBadge() {
        return new Badge("2", "2 notifications", Badge.Severity.DANGER);
    }
}
