package jenkins;

public class JavascriptMenuItemAction implements MenuItemAction {
	private String javascript;

	public JavascriptMenuItemAction(String javascript) {
		this.javascript = javascript;
	}

	public String getJavascript() {
		return javascript;
	}

	public void setJavascript(String javascript) {
		this.javascript = javascript;
	}
}
