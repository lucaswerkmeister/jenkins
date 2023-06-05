package jenkins.model.navigation;

public class NavWrap {

    private final Class<? extends NavigationItem> navigationItem;

    private final NavWrapStatus status;

    public NavWrap(Class<? extends NavigationItem> navigationItem, NavWrapStatus status) {
        this.navigationItem = navigationItem;
        this.status = status;
    }

    public Class<? extends NavigationItem> getNavigationItem() {
        return navigationItem;
    }

    public NavWrapStatus getStatus() {
        return status;
    }
}
