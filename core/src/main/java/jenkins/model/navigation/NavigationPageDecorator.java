package jenkins.model.navigation;

import hudson.Extension;
import hudson.ExtensionList;
import hudson.model.PageDecorator;
import java.util.List;
import net.sf.json.JSONObject;
import org.jenkinsci.Symbol;
import org.kohsuke.stapler.StaplerRequest;

@Extension
@Symbol("navigation")
public class NavigationPageDecorator extends PageDecorator {

    private List<NavigationExtension> navigationExtensionList;

    public NavigationPageDecorator() {
        load();
    }

    public static NavigationPageDecorator get() {
        return ExtensionList.lookupSingleton(NavigationPageDecorator.class);
    }

    @Override
    public boolean configure(StaplerRequest req, JSONObject formData) {
        req.bindJSON(this, formData);
        save();
        return true;
    }

//    @DataBoundSetter
//    public void setItems() {
//
//    }

//    @DataBoundSetter
//    public void setTheme(NavigationExtension theme) {
//        this.theme = theme;
//    }

//    public NavigationExtension getTheme() {
//        return theme;
//    }

    /**
     * Finds the active theme. Checks User and then global theme.
     *
     * @return the active theme, or a no-op theme if not selected
     */
//    @NonNull
    public List<NavigationItem> findNavs() {
        return List.of(
                new DashboardNavigationItem(),
                new CommandPaletteNavigationItem(),
                new BuildHistoryNavigationItem(),
                new UserNavigationItem(),
                new SettingsNavigationItem(),
                new PluginsNavigationItem()
        );
    }
}
