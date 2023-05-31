package jenkins.model.navigation;

public class BuildHistoryNavigationItem implements NavigationItem {

    @Override
    public String getDisplayName() {
        return "Build history";
    }

    @Override
    public String getIcon() {
        return "symbol-build-history";
    }

    @Override
    public String getUrl() {
        return "view/all/builds";
    }
}
