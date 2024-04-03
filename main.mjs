//import { Worker, isMainThread, parentPort } from "worker_threads";
import { convertAndSaveToJSON } from "./converter.mjs";
import { execFileSync } from "node:child_process";

console.log('start');
try {
    execFileSync('node', ['fetcher.mjs']);
} finally {
    convertAndSaveToJSON();
    console.log('finally');
}

console.log('never end');