package hudson.search;

import jenkins.model.Jenkins;
import org.kohsuke.stapler.export.Exported;
import org.kohsuke.stapler.export.ExportedBean;

@ExportedBean(defaultVisibility=999)
public class Icon {
	@Exported
	public String svg;
	@Exported
	public String url;

	private Icon() {}

	public static Icon fromSvg(String svg) {
		Icon icon = new Icon();
		icon.svg = svg;
		return icon;
	}

	public static Icon fromUrl(String url) {
		Icon icon = new Icon();
		icon.url = url;
		return icon;
	}
}
