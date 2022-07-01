# 100 prisoners problem

## Intro

The 100 prisoners problem was first considered in 2003 by Danish computer scientist Peter Bro Miltersen who published it with Anna Gál.

In 2009 Philippe Flajolet and Robert Sedgewick summarized the riddle as follows:

The director of a prison offers 100 death row prisoners, who are numbered from 1 to 100, a last chance. A room contains a cupboard with 100 drawers. The director randomly puts one prisoner's number in each closed drawer. The prisoners enter the room, one after another. Each prisoner may open and look into 50 drawers in any order. The drawers are closed again afterwards. If, during this search, every prisoner finds his number in one of the drawers, all prisoners are pardoned. If just one prisoner does not find his number, all prisoners die. Before the first prisoner enters the room, the prisoners may discuss strategy — but may not communicate once the first prisoner enters to look in the drawers. What is the prisoners' best strategy?

## Prereqs

You need to have deno installed https://deno.land/. Check with the `deno -h` command.

## Strategies

Strategies can be created and added to the `./strategies` directory. Since there is no collaboration between prisoners after the first one enters, only the drawers and the current prisoner's number are passed to the function. A valid stategy must be the default export of the module.

### `Drawer`

- `<Object>`
  - drawerNumber `<number>`
  - prisonerNumber `<number>`

### `strategyCallback(drawers, prisonerNumber)`

- `drawers` `<Drawer[]>` the drawers the prisoner has to choose from. This array is generated randomly after each iteration of a simulation.
- `prisonerNumber` `<number>` the prisoner number of the current prisoner
- Returns: `<Drawers[]>` An array of drawers, but it must be no more than half the quantity that enters the callback

### Example

```typescript
import { Drawer } from "../mod.ts";

const sequentialStrategy = (
  _drawers: readonly Drawer[],
  num: number
): Drawer[] => {
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
  return result;
};

export default sequentialStrategy;
```

## Simulate

Run the simulation using a Deno task with arguments.

```bash
deno task simulate <strategy> [-i | --iterations] [-p | --prisoners]
```

### `<strategy>`

The strategy argument uses the filename of the strategy INCLUDING the extension.

### -i

### --iterations

The number of iterations to run the entire simulation. Defaults to 1.

### -p

### --prisoners

The number of prisoners and drawers that will be simulated. Defaults to 100.

### Example

The following command:

```bash
deno task simulate random.ts -i 100 -p 10
```

Will usually output the following table:

```bash
┌────────┬────────┐
│ (idx)  │ Values │
├────────┼────────┤
│ fails  │    100 │
│ passes │      0 │
│ total  │    100 │
└────────┴────────┘
```
