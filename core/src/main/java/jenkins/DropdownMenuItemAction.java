package jenkins;

import java.util.List;

public class DropdownMenuItemAction implements MenuItemAction {
	private List<MenuItemActionBoi> children;

	public DropdownMenuItemAction(List<MenuItemActionBoi> children) {
		this.children = children;
	}

	public List<MenuItemActionBoi> getChildren() {
		return children;
	}

	public void setChildren(List<MenuItemActionBoi> children) {
		this.children = children;
	}
}
