package hudson.search;

import org.kohsuke.stapler.export.Exported;
import org.kohsuke.stapler.export.ExportedBean;

import java.net.URI;

@ExportedBean(defaultVisibility=999)
public class SearchItemIcon {
	@Exported
	public String svg;
	@Exported
	public URI url;

	public SearchItemIcon(String svg) {
		this.svg = svg;
	}

	public SearchItemIcon(URI url) {
		this.url = url;
	}
}
