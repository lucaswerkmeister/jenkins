package jenkins.model.navigation;

public class DesignLibraryNavigationItem implements NavigationItem {

    @Override
    public String getDisplayName() {
        return "Design Library";
    }

    @Override
    public String getIcon() {
        return "symbol-design-library";
    }

    @Override
    public String getUrl() {
        return "design-library";
    }
}
