import { Drawer, getRandomIndex } from "../mod.ts";

const randomStrategy = (_drawers: readonly Drawer[]) => {
  const drawers = [..._drawers];
  const result: Drawer[] = [];
  for (let i = 0; i < drawers.length / 2; i++) {
    const idx = getRandomIndex(drawers);
    result.push(drawers[idx]);
    drawers.splice(idx, 1);
  }
  return result;
};

export default randomStrategy;
