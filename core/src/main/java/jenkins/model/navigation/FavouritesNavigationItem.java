package jenkins.model.navigation;

public class FavouritesNavigationItem implements NavigationItem {

    @Override
    public String getDisplayName() {
        return "Favourites";
    }

    @Override
    public String getIcon() {
        return "symbol-star";
    }

    @Override
    public String getUrl() {
        return "favourites";
    }
}
