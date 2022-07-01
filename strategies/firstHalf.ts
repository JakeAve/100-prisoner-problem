import { Drawer } from "../mod.ts";

const sequentialStrategy = (_drawers: readonly Drawer[], num: number) => {
  const drawers = [..._drawers];
  const result: Drawer[] = [];
  const maxSelection = _drawers.length / 2;
  let idx = _drawers.findIndex(
    (d) =>
      d.drawerNumber /* Only the drawerNumber is visible to the prisoner when entering the room */ ===
      num
  );
  while (result.length < maxSelection) {
    result.push(drawers[idx]);
    idx = idx + 1 === drawers.length ? 0 : idx + 1;
  }
  return "foo";
};

export default sequentialStrategy;
