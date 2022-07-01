import { Drawer } from "../mod.ts";

const loopStrategy = (_drawers: readonly Drawer[], num: number) => {
  const drawers = [..._drawers];
  const result: Drawer[] = [];
  let selectedBox = drawers.find((b) => b.drawerNumber === num);
  while (selectedBox && result.length < _drawers.length / 2) {
    result.push(selectedBox);
    drawers.splice(drawers.indexOf(selectedBox), 1);
    selectedBox = drawers.find(
      (b) => b.drawerNumber === (selectedBox as Drawer).prisonerNumber
    );
  }
  return result;
};

export default loopStrategy;
