import CommandPaletteHelpers from "./helpers";
import {LinkResult} from "./models";
import Search from "@/api/search";

async function getResults(query) {
  const response = await Search.search(query);
  return await response.json().then(data => {
    const results = [...data["suggestions"]].map(e => new LinkResult(e.icon, e.name, e.description, e.category, e.url));
    return CommandPaletteHelpers.groupByKey(results, "category");
  });
}

export default {getResults: getResults}
