import { parse } from "https://deno.land/std@0.146.0/flags/mod.ts";
import { runSimulation } from "./mod.ts";

const parsedArgs = parse(Deno.args);

const {
  _: [strategyName],
} = parsedArgs;

const iterations = parsedArgs.iterations ?? parsedArgs.i ?? 1;
const prisoners = parsedArgs.prisoners ?? parsedArgs.p ?? 100;

const strategy = await import(`./strategies/${strategyName}`);

const results = runSimulation(strategy.default, iterations, prisoners);

console.table(results);
