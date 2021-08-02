import * as itemPickup from "./itemPickup";
import * as saveDataManager from "./saveDataManager";

export default class ModUpgraded {
  constructor() {
    saveDataManager.init();
    itemPickup.init();
  }
}
