package jenkins.model.navigation;

import hudson.ExtensionPoint;
import hudson.model.AbstractDescribableImpl;

public abstract class NavigationExtension extends AbstractDescribableImpl<NavigationExtension> implements ExtensionPoint {

    @Override
    public NavigationFactoryDescriptor getDescriptor() {
        return (NavigationFactoryDescriptor) super.getDescriptor();
    }
}
