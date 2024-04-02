import puppeteer from "puppeteer-extra";
import createPuppeteerStealth from "puppeteer-extra-plugin-stealth";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "url";

const source_info = [
  {
    name: "abilities",
    url: "https://bulbapedia.bulbagarden.net/wiki/List_of_Abilities_in_other_languages",
    waitTagId: "span#List_of_Abilities_in_other_languages",
  },
  {
    name: "moves",
    url: "https://bulbapedia.bulbagarden.net/wiki/List_of_moves_in_other_languages",
    waitTagId: "span#List_of_moves_in_other_languages",
  },
  {
    name: "items",
    url: "https://bulbapedia.bulbagarden.net/wiki/List_of_items_in_other_languages",
    waitTagId: "span#Medicines",
  },
  {
    name: "natures",
    url: "https://bulbapedia.bulbagarden.net/wiki/Nature#Specific_Natures",
    waitTagId: "span#In_other_languages",
  },
];

async function saveUrlAsHTML(
  browser,
  url,
  waitId = "div#mw-content-text",
  saveName = "untitled"
) {
  let newPage = await browser.newPage();
  //page.setDefaultTimeout(60*1000);
  console.log(`will save: ${url} => ${saveName}`);
  newPage.goto(url);
  console.log(`waiting tag: ${waitId}`);
  await newPage.waitForSelector(waitId).then(() => {
    console.log("data loaded");
  });

  const body = await newPage.content();
  writeFileSync(`savePages/${saveName}.html`, body);
  return newPage;
}

async function savePages() {
  // init browser
  const puppeteerStealth = createPuppeteerStealth();
  //puppeteerStealth.enabledEvasions.delete('user-agent-override');
  puppeteer.use(puppeteerStealth);
  const browser = await puppeteer.launch({
    //headless: false,
    targetFilter: (target) => target.type() !== "other",
  });

  // call the fetch function async
  let allFetchPromise = [];
  for (let i = 0; i < source_info.length; i++) {
    allFetchPromise.push(
      saveUrlAsHTML(
        browser,
        source_info[i]["url"],
        source_info[i]["waitTagId"],
        source_info[i]["name"]
      )
    );
  }
  await Promise.all(allFetchPromise);

  console.log("Warning: just a bug, throwing an exception");
  // TODO: use stealth plugin to fetch cloudflare but page.close() will crash
  await browser.close();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log("downloading...");
  await savePages();
}

export { savePages };
