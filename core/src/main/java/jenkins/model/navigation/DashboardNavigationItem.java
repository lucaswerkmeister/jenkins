package jenkins.model.navigation;

public class DashboardNavigationItem implements NavigationItem {

    @Override
    public String getDisplayName() {
        return "Dashboard";
    }

    @Override
    public String getIcon() {
        return "symbol-home";
    }

    @Override
    public String getUrl() {
        return "";
    }
}
