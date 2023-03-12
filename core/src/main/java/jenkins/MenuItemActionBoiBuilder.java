package jenkins;

public class MenuItemActionBoiBuilder {
	private String label;
	private String icon;
	private MenuItemAction action;
	private boolean visible;

	// The below are nullable
	private String description;
	private Color color;
	private String category;

	public MenuItemActionBoiBuilder setLabel(String label) {
		this.label = label;
		return this;
	}

	public MenuItemActionBoiBuilder setIcon(String icon) {
		this.icon = icon;
		return this;
	}

	public MenuItemActionBoiBuilder setDescription(String description) {
		this.description = description;
		return this;
	}

	public MenuItemActionBoiBuilder setAction(MenuItemAction action) {
		this.action = action;
		return this;
	}

	public MenuItemActionBoiBuilder setColor(Color color) {
		this.color = color;
		return this;
	}

	public MenuItemActionBoiBuilder setCategory(String category) {
		this.category = category;
		return this;
	}

	public MenuItemActionBoiBuilder setVisible(boolean visible) {
		this.visible = visible;
		return this;
	}

	public MenuItemActionBoi build() {
		return new MenuItemActionBoi(label, icon, description, action, color, category, visible);
	}
}
