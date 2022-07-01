const makeNumArray = (num: number) => {
  const arr: number[] = [];
  for (let i = 1; i <= num; i++) arr.push(i);
  return arr;
};

// deno-lint-ignore no-explicit-any
export const getRandomIndex = (arr: any[]) =>
  Math.floor(Math.random() * arr.length);

export interface Drawer {
  drawerNumber: number;
  prisonerNumber: number;
}

export const createDrawers = (num: number) => {
  const prisoners = makeNumArray(num);

  const drawers: Drawer[] = [];
  for (let i = 1; i <= num; i++) {
    const idx = getRandomIndex(prisoners);
    const prisonerNumber = prisoners[idx];
    drawers.push({ drawerNumber: i, prisonerNumber });
    prisoners.splice(idx, 1);
  }

  return drawers;
};

export const runSimulation = (
  strategy: (drawers: readonly Drawer[], prisonerNumber: number) => Drawer[],
  numberOfSimulations = 1,
  numberOfPrisoners = 100
) => {
  let fails = 0;
  for (let i = 0; i < numberOfSimulations; i++) {
    const drawers = createDrawers(numberOfPrisoners);
    Object.freeze(drawers);
    for (let j = 1; j <= numberOfPrisoners; j++) {
      const halfTheDrawers = strategy(drawers, j);

      if (!Array.isArray(halfTheDrawers))
        throw new Error("Strategy must return an array");

      const didOpenLessThanHalf =
        halfTheDrawers.length <= numberOfPrisoners / 2;
      if (!didOpenLessThanHalf)
        throw new Error(`Prisoner ${j} opened more than half the drawers`);

      const areValidDrawers = halfTheDrawers.every((b) => drawers.includes(b));
      if (!areValidDrawers)
        throw new Error(
          `Prisoner ${j} opened invalid drawers ${halfTheDrawers}`
        );

      // if one prisoner fails, the whole simulation fails
      const isCorrectNumber = halfTheDrawers.some(
        (b) => b.prisonerNumber === j
      );
      if (!isCorrectNumber) {
        fails++;
        break;
      }
    }
  }

  return {
    fails,
    passes: numberOfSimulations - fails,
    total: numberOfSimulations,
  };
};
