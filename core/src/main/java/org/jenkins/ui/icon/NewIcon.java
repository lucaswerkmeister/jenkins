package org.jenkins.ui.icon;

public class NewIcon {
	private String svg;
	private String path;

	private NewIcon() {}

	public static NewIcon fromSvg(String svg) {
		NewIcon newIcon = new NewIcon();
		newIcon.svg = svg;
		return newIcon;
	}

	public static NewIcon fromFileName(String fileName) {
		NewIcon newIcon = new NewIcon();
		newIcon.path = fileName;
		return newIcon;
	}

	public String getSvg() {
		return svg;
	}

	public String getPath() {
		return path;
	}
}
