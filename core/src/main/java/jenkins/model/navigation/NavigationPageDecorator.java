package jenkins.model.navigation;

import hudson.Extension;
import hudson.ExtensionList;
import hudson.model.PageDecorator;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import net.sf.json.JSONObject;
import org.jenkinsci.Symbol;
import org.kohsuke.stapler.DataBoundSetter;
import org.kohsuke.stapler.StaplerRequest;

@Extension
@Symbol("navigation")
public class NavigationPageDecorator extends PageDecorator {

    private List<NavWrap> navigationExtensionList;

    public NavigationPageDecorator() {
        load();
    }

    public static NavigationPageDecorator get() {
        return ExtensionList.lookupSingleton(NavigationPageDecorator.class);
    }

    @Override
    public boolean configure(StaplerRequest req, JSONObject formData) {
        List<NavWrap> navWraps = new ArrayList<>();

        formData.getJSONObject("navigationExtensionList").keySet().forEach(key -> {
            Class<? extends NavigationItem> clazz;
            try {
                clazz = (Class<? extends NavigationItem>) Class.forName(((String) key).replace("-", "."));
            } catch (ClassNotFoundException e) {
                throw new RuntimeException(e);
            }
            String status = formData.getJSONObject("navigationExtensionList").getString((String) key);
            NavWrapStatus mappedStatus = NavWrapStatus.valueOf(status);

            navWraps.add(new NavWrap(clazz, mappedStatus));
        });

        setNavigationExtensionList(navWraps);

        save();
        return true;
    }

    public List<NavWrap> getNavigationExtensionList() {
        return navigationExtensionList;
    }

    @DataBoundSetter
    public void setNavigationExtensionList(List<NavWrap> navigationExtensionList) {
        this.navigationExtensionList = navigationExtensionList;
    }

    public NavWrapStatus getStatus(String className) {
        List<NavWrap> collect = this.navigationExtensionList.stream()
                .filter(e -> e.getNavigationItem().getName().equals(className))
                .collect(Collectors.toList());

        if (collect.size() == 0) {
            return NavWrapStatus.SHOW;
        }

        return collect.get(0).getStatus();
    }

    // To remove
    public List<NavigationItem> findNavs() {
        return List.of(
                new BuildHistoryNavigationItem(),
                new PeopleNavigationItem(),
                new PluginsNavigationItem(),
                new DesignLibraryNavigationItem(),
                new FavouritesNavigationItem(),
                new ThemeManagerNavigationItem()
        );
    }

    public List<NavigationItem> getVisibleItems() {
        List<NavigationItem> start = List.of(
                new DashboardNavigationItem(),
                new CommandPaletteNavigationItem()
        );
        List<NavigationItem> middle = getNavigationExtensionList().stream()
                .filter(e -> e.getStatus() == NavWrapStatus.SHOW)
                .map(e -> {
                    try {
                        return e.getNavigationItem().getConstructor().newInstance();
                    } catch (Exception ex) {
                        throw new RuntimeException(ex);
                    }
                })
                .collect(Collectors.toList());
        List<NavigationItem> end = List.of(
                new UserNavigationItem(),
                new SettingsNavigationItem()
        );

        return Stream.of(start, middle, end)
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }

    // TODO
    public List<NavigationItem> getOverflowItems() {
        return getNavigationExtensionList().stream()
                .filter(e -> e.getStatus() == NavWrapStatus.SHOW_IN_OVERFLOW)
                .map(e -> {
                    try {
                        return e.getNavigationItem().getConstructor().newInstance();
                    } catch (Exception ex) {
                        throw new RuntimeException(ex);
                    }
                })
                .collect(Collectors.toList());
    }
}
