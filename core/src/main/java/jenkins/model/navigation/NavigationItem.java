package jenkins.model.navigation;

import jenkins.management.Badge;

public interface NavigationItem {

    String getDisplayName();

    String getIcon();

    String getUrl();

    default Badge getBadge() {
        return null;
    }
}
