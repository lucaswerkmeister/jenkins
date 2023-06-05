package jenkins.model.navigation;

public class PeopleNavigationItem implements NavigationItem {

    @Override
    public String getDisplayName() {
        return "People";
    }

    @Override
    public String getIcon() {
        return "symbol-people";
    }

    @Override
    public String getUrl() {
        return "asynchPeople";
    }
}
