import { parse } from "https://deno.land/std@0.146.0/flags/mod.ts";
import { runSimulation } from "./mod.ts";

const parsedArgs = parse(Deno.args, {
  alias: { i: "iterations", p: "prisoners" },
});

const {
  _: [strategyName],
} = parsedArgs;

const iterations = parsedArgs.iterations ?? 1;
const prisoners = parsedArgs.prisoners ?? 100;

const strategy = await import(`./strategies/${strategyName}`);

const results = runSimulation(strategy.default, iterations, prisoners);

console.table(results);
