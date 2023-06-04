package jenkins.model.navigation;

import hudson.Functions;
import hudson.model.User;
import hudson.security.SecurityRealm;
import jenkins.model.Jenkins;

public class UserNavigationItem implements NavigationItem {

    private final Jenkins jenkins;

    public UserNavigationItem() {
        this.jenkins = Jenkins.get();
    }

    @Override
    public String getDisplayName() {
        boolean isAnonymous = Functions.isAnonymous();

        if (isAnonymous) {
            return "Sign in or register";
        }

        return User.current().getFullName();
    }

    @Override
    public String getIcon() {
        return "symbol-person";
    }

    @Override
    public String getUrl() {
        boolean isAnonymous = Functions.isAnonymous();

        if (isAnonymous) {
            return jenkins.getSecurityRealm().getLoginUrl() + "?from=" + SecurityRealm.getFrom();
        }

        return User.current().getUrl();
    }
}
