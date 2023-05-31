package jenkins.model.navigation;

public class UserNavigationItem implements NavigationItem {

    @Override
    public String getDisplayName() {
        return "You!";
    }

    @Override
    public String getIcon() {
        return "symbol-person";
    }

    @Override
    public String getUrl() {
        return "asynchPeople";
    }
}
