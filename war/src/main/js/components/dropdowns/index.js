import HeteroList from "@/components/dropdowns/hetero-list";
import Jumplists from "@/components/dropdowns/jumplists";
import InpageJumplist from "@/components/dropdowns/inpage-jumplist";

function init() {
  HeteroList.init();
  Jumplists.init();
  InpageJumplist.init();
}

export default { init };
