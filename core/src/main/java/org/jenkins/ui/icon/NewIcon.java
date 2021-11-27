package org.jenkins.ui.icon;

public class NewIcon {
	private String svg;
	private String path;

	private NewIcon() {}

	/**
	 * @param xml The XML of the SVG image you want to use
	 *            You can use icon sources such as Ionicon eg
	 *            'NewIcon.fromSvg(IconSet.getIonicon("terminal-outline", null))' to get SVG data
	 * @return a NewIcon object with the svg set
	 */
	public static NewIcon fromSvg(String xml) {
		NewIcon newIcon = new NewIcon();
		newIcon.svg = xml;
		return newIcon;
	}

	/**
	 * @param relativePath The relative path from 'webapp', eg 'images/48x48/accept.png'
	 * @return a NewIcon object with the address set to '{ROOT}/images/48x48/accept.png'
	 */
	public static NewIcon fromRelativePath(String relativePath) {
		NewIcon newIcon = new NewIcon();
		newIcon.path = "" + relativePath;
		return newIcon;
	}

	/**
	 * @param absolutePath The absolute path of the image, eg 'https://licensebuttons.net/l/by-sa/4.0/88x31.png'
	 * @return a NewIcon object with the address set to 'https://licensebuttons.net/l/by-sa/4.0/88x31.png'
	 */
	public static NewIcon fromAbsolutePath(String absolutePath) {
		NewIcon newIcon = new NewIcon();
		newIcon.path = absolutePath;
		return newIcon;
	}

	public String getSvg() {
		return svg;
	}

	public String getPath() {
		return path;
	}
}
