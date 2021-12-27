package hudson;

import edu.umd.cs.findbugs.annotations.NonNull;
import hudson.model.ManagementLink;
import hudson.search.Icon;
import hudson.search.Search;
import hudson.security.Permission;
import java.net.URL;
import jenkins.model.Jenkins;
import org.jenkins.ui.icon.IconSet;
import org.jenkinsci.Symbol;
import org.kohsuke.accmod.Restricted;
import org.kohsuke.accmod.restrictions.NoExternalUse;

/**
 * Show "About Jenkins" link.
 * 
 * @author Kohsuke Kawaguchi
 */
@Extension @Symbol("about")
public class AboutJenkins extends ManagementLink {
    @Override
    public String getIconFileName() {
        return "help.png";
    }

    @Override
    public String getUrlName() {
        return "about";
    }

    @Override
    public String getDisplayName() {
        return Messages.AboutJenkins_DisplayName();
    }

    @Override
    public String getDescription() {
        return Messages.AboutJenkins_Description();
    }

    @Override
    public String getSearchDescription() {
        return "Version " + Functions.getVersion();
    }

    @Override
    public Icon getSearchItemIcon() {
        return Icon.fromSvg(IconSet.getIonicon("logo", null));
    }

    @Restricted(NoExternalUse.class)
    public URL getLicensesURL() {
        return AboutJenkins.class.getResource("/META-INF/licenses.xml");
    }

    @NonNull
    @Override
    public Permission getRequiredPermission() {
        return Jenkins.READ;
    }

    @NonNull
    @Override
    public Category getCategory() {
        return Category.STATUS;
    }
}
