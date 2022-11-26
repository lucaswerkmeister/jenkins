import Jumplists from "@/components/dropdowns/jumplists";
import InpageJumplist from "@/components/dropdowns/inpage-jumplist";
import Overflow from "@/components/dropdowns/overflow";
import HeteroList from "@/components/dropdowns/hetero-list";

function init() {
  Jumplists.init();
  InpageJumplist.init();
  Overflow.init();
  HeteroList.init();
}

export default { init };
