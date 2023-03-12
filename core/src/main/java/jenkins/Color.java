package jenkins;

public enum Color {
	RED("jenkins-!-red-color"),
	BLUE("jenkins-!-blue-color");

	private String cssClass;

	Color(String cssClass) {
		this.cssClass = cssClass;
	}
}
