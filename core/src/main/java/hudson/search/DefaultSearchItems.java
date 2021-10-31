package hudson.search;

import org.jenkins.ui.icon.IconSet;

public class DefaultSearchItems {
	public static final SearchItem manageJenkinsSearchItem = SearchItems.create(
			"Manage Jenkins",
			"/manage",
			null,
			Icon.fromSvg(IconSet.getIonicon("settings-outline", null)),
			SearchItemCategory.PAGES);
	public static final SearchItem peopleSearchItem = SearchItems.create(
			"People",
			"/asynchPeople",
			null,
			Icon.fromSvg(IconSet.getIonicon("people-outline", null)),
			SearchItemCategory.PAGES);
	public static final SearchItem buildHistorySearchItem = SearchItems.create(
			"Build history",
			"/view/all/builds",
			null,
			Icon.fromSvg(IconSet.getIonicon("analytics-outline", null)),
			SearchItemCategory.PAGES);
}
