package jenkins;

public class LinkMenuItemAction implements MenuItemAction {
	private String url;

	public LinkMenuItemAction(String url) {
		this.url = url;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
