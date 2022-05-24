import {LinkResult} from "./models";
import Search from "@/api/search";

export const JenkinsSearchSource = {
  async execute(query) {
    const response = await Search.search(query);
    return await response.json().then(data => {
      return [...data["suggestions"]].map(e => new LinkResult(e.icon, e.name, e.description, e.category, e.url));
    });
  }
}
