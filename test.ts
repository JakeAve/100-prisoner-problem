import { assertEquals } from "https://deno.land/std@0.146.0/testing/asserts.ts";
import { createDrawers, Drawer, getRandomIndex, runSimulation } from "./mod.ts";

Deno.test("getRanomIndex never exceeds max or min", () => {
  const arr = [1, 2, 3, 4, 5];
  let max = arr.length - 1;
  let min = 0;
  for (let i = 0; i < 100; i++) {
    const idx = getRandomIndex(arr);
    max = Math.max(max, idx);
    min = Math.min(min, idx);
  }
  assertEquals(max <= arr.length - 1 && min >= 0, true);
});

Deno.test("getRanomIndex is mostly random", () => {
  const arr = [1, 2, 3, 4, 5];
  const counts: { [key: number]: number } = {};
  for (let i = 0; i < 100; i++) {
    const idx = getRandomIndex(arr);
    counts[idx] = (counts[idx] || 0) + 1;
  }
  const eachIsMostlyRandom = Object.values(counts).every((value) => {
    return value > 0 && value < 50;
  });
  assertEquals(eachIsMostlyRandom, true);
});

Deno.test("createDrawers creates correct number", () => {
  const drawers = createDrawers(5);
  assertEquals(drawers.length, 5);
});

Deno.test("createDrawers creates corerct type", () => {
  const drawers = createDrawers(5);
  const allAreCorrectType = drawers.every(
    (drawer) => drawer.drawerNumber && drawer.prisonerNumber
  );
  assertEquals(allAreCorrectType, true);
});

Deno.test("createDrawers mixes up drawer and prisoner numbers", () => {
  const drawers = createDrawers(5);
  const allAreDifferent = drawers.some(
    (drawer) => drawer.drawerNumber !== drawer.prisonerNumber
  );
  assertEquals(allAreDifferent, true);
});

Deno.test("runSimulations does correct amount of iterations", () => {
  const strategy = (drawers: readonly Drawer[]) =>
    drawers.slice(0, drawers.length / 2);

  const results = runSimulation(strategy, 7);
  assertEquals(results.total, 7);
});

Deno.test(
  "runSimulations passes correct amount of drawers into strategy",
  () => {
    const plannedNumberOfDrawers = 500;
    const actualNumberOfDrawers: number[] = [];

    const strategy = (drawers: readonly Drawer[]) => {
      const halfTheDrawers = drawers.slice(0, drawers.length / 2);
      actualNumberOfDrawers.push(halfTheDrawers.length * 2);
      return halfTheDrawers;
    };

    runSimulation(strategy, 1, plannedNumberOfDrawers);

    const allAreEqual = actualNumberOfDrawers.every(
      (value) => value === plannedNumberOfDrawers
    );
    assertEquals(allAreEqual, true);
  }
);

Deno.test("runSimulations passes correct structure of drawers", () => {
  const drawerCollection: Drawer[] = [];

  const strategy = (drawers: readonly Drawer[]) => {
    const halfTheDrawers = drawers.slice(0, drawers.length / 2);
    drawerCollection.push(...drawers);
    return halfTheDrawers;
  };

  runSimulation(strategy, 1, 100);

  const allAreCorrectType = drawerCollection.every(
    (value) => value.drawerNumber && value.prisonerNumber
  );
  assertEquals(allAreCorrectType, true);
});

Deno.test("runSimulations passes correct prisoner number", () => {
  const expectedPrisonerNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const actualPrisonerNumbers: number[] = [];
  const strategy = (drawers: readonly Drawer[], prisonerNumber: number) => {
    const halfTheDrawers = drawers.slice(0, drawers.length / 2);
    actualPrisonerNumbers.push(prisonerNumber);
    return halfTheDrawers;
  };

  runSimulation(strategy, 1, 10);

  const allAreEqual = actualPrisonerNumbers.every(
    (value, i) => value === expectedPrisonerNumbers[i]
  );
  assertEquals(allAreEqual, true);
});

Deno.test("A bad strategy always fails", () => {
  const numberOfSims = 100;
  const strategy = (drawers: readonly Drawer[]) => [drawers[0]];

  const results = runSimulation(strategy, numberOfSims);
  assertEquals(results.total, numberOfSims);
  assertEquals(results.fails, numberOfSims);
  assertEquals(results.passes, 0);
});

Deno.test("A winning strategy always wins", () => {
  const numberOfSims = 100;
  const strategy = (drawers: readonly Drawer[], prisonerNumber: number) => {
    const drawer = drawers.find(
      (drawer) => drawer.prisonerNumber === prisonerNumber
    );
    if (drawer) return [drawer];
    else return [drawers[0]];
  };

  const results = runSimulation(strategy, numberOfSims);
  assertEquals(results.total, numberOfSims);
  assertEquals(results.fails, 0);
  assertEquals(results.passes, numberOfSims);
});
