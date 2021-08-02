import PickingUpItem from "./PickingUpItem";
import { saveDataManager } from "./saveDataManager";

export type PlayerIndex = string & { __playerIndexBrand: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

const v = {
  run: {
    pickingUpItem: new Map<PlayerIndex, PickingUpItem>(),
  },
};

export function init(): void {
  saveDataManager("itemPickupCallback", v);
}
