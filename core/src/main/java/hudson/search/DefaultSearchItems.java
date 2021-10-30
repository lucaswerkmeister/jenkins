package hudson.search;

import org.jenkins.ui.icon.IconSet;

public class DefaultSearchItems {




	public static final SearchItem manageJenkinsSearchItem = SearchItems.create(
			"Manage Jenkins",
			"/manage",
			null,
			Icon.fromSvg(IconSet.getIonicon("settings-outline", null)),
			SearchItemCategory.SETTING);
	public static final SearchItem logSearchItem = SearchItems.create(
			"Log Records",
			"/log",
			null,
			Icon.fromSvg(IconSet.getIonicon("settings-outline", null)),
			SearchItemCategory.SETTING);
}
