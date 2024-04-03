import { parse } from "node-html-parser";
import { readFileSync, writeFileSync } from "node:fs";
import * as path from 'path';
import { fileURLToPath } from "url";

/*
  basic functions
*/
function convert1LangTable(oneTable) {
  const trs = oneTable.getElementsByTagName("tr");
  let res = {
    title: [],
    body: [],
  };

  // title row (1st)
  const tr1 = trs[0];
  for (let th of tr1.getElementsByTagName("th")) {
    res.title.push(th.innerText.trim());
    res.body.push([]); // placeholder for contents by langs
  }

  // content rows
  for (let i = 1; i < trs.length; i++) {
    let row = trs[i].getElementsByTagName("td");
    for (let j = 0; j < row.length; j++) {
      let cell = row[j];
      res.body[j].push(cell.innerText.trim());
    }
  }
  return res;
}

function concatLangTablesArray(arrayOfTables) {
  // assert the tables have same title
  // assert the tables have same num of columns
  let firstTitle = arrayOfTables[0].title;
  let firstLength = arrayOfTables[0].title.length;
  for (let table of arrayOfTables) {
    console.assert(
      table.title.toString() == firstTitle.toString(),
      "same title"
    );
    console.assert(table.title.length == firstLength, "same title count");
    console.assert(table.body.length == firstLength, "same body count");
  }

  // do the concat
  // init res
  let res = { title: [firstTitle], body: [] };
  for (let _ of firstTitle) {
    res.body.push([]);
  }

  // use concat
  for (let table of arrayOfTables) {
    for (let i = 0; i < table.body.length; i++) {
      res.body[i] = res.body[i].concat(table.body[i]);
    }
  }
  return res;
}

/*
  helper functions
*/
function convertSomeLangTables(fPath, position = 0) {
  // init parse
  const f = readFileSync(fPath);
  const root = parse(f.toString());
  const tables = root.querySelectorAll("table");

  // get table to convert
  // if position is one id
  if (typeof position === "number") {
    const tableId = position;
    return convert1LangTable(tables[tableId]);
  }
  // if position is an array
  else if (Array.isArray(position)) {
    let tmpArrays = [];
    let tableIds = position;
    //
    for (let i = 0; i < tableIds.length; i++) {
      let curTable = tables[tableIds[i]];
      tmpArrays.push(convert1LangTable(curTable));
    }
    return concatLangTablesArray(tmpArrays);
  } else return false;
}

/*
  main functions to convert
*/
const source_info = [
  { name: "ability", fPath: "savePages/abilities.html", position: 0 },
  {
    name: "item",
    fPath: "savePages/items.html",
    position: [0, 4, 5, 6, 10, 11, 12, 13, 14, 15, 16, 18, 24],
  },
  { name: "move", fPath: "savePages/moves.html", position: 1 },
  { name: "nature", fPath: "savePages/natures.html", position: 11 },
];

function convertHTML(info) {
  let res = convertSomeLangTables(info.fPath, info.position);
  res.name = info.name;
  return res;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log("converting...");
  source_info.map((info) => {
    let tmp = convertHTML(info);
    writeFileSync(path.join('out',`${info.name}.json`), JSON.stringify(tmp));
  });
}
