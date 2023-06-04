package jenkins.model.navigation;

import jenkins.management.Badge;

public class PluginsNavigationItem implements NavigationItem {

    @Override
    public String getDisplayName() {
        return "Plugins";
    }

    @Override
    public String getIcon() {
        return "symbol-plugins";
    }

    @Override
    public String getUrl() {
        return "manage/pluginManager";
    }

    @Override
    public Badge getBadge() {
        return new Badge("3", "3 updates available", Badge.Severity.WARNING);
    }
}
