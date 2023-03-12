package jenkins;

public class MenuItemActionBoi {
	String label;
	String icon;
	String description;
	MenuItemAction action; // e.g. link, execute js, another dropdown?
	Color color; // color of the item (e.g. red)
	String category; // where should the item be
	boolean visible;

	public static final String TOP_LEVEL_CATEGORY = "top-level";
	public static final String BOTTOM_LEVEL_CATEGORY = "bottom-level";

	public MenuItemActionBoi(String label, String icon, String description, MenuItemAction action, Color color, String category, boolean visible) {
		this.label = label;
		this.icon = icon;
		this.description = description;
		this.action = action;
		this.color = color;
		this.category = category;
		this.visible = visible;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public MenuItemAction getAction() {
		return action;
	}

	public void setAction(MenuItemAction action) {
		this.action = action;
	}

	public Color getColor() {
		return color;
	}

	public void setColor(Color color) {
		this.color = color;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}


}
