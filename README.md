# vgctrans-data
a data crawler for [vgctrans](https://github.com/ezel/vgctrans),
using data from bulbapedia.bulbagarden.net, links are:
[abilities](https://bulbapedia.bulbagarden.net/wiki/List_of_Abilities_in_other_languages),
[moves](https://bulbapedia.bulbagarden.net/wiki/List_of_moves_in_other_languages),
[items](https://bulbapedia.bulbagarden.net/wiki/List_of_items_in_other_languages),
[natures](https://bulbapedia.bulbagarden.net/wiki/Nature#Specific_Natures),

## Usage
  ```sh
  node main.mjs
  ```
will get 4 json files, the data structure is like
  ```js
  data = {
    name: 'move', // name of the page
    title:[],     // the first row's th, mostly is a language title
    body:[[],[]], // the body of the tables, body[n] is the content in language title[n], usually n > 0 has data ;
                  // the other language of body[a][x] is in body[b][x], body[c][x], ... 
    };
  ```

### if it dose not work
  save the 4 html pages into savePages directory manually, and then
  ```sh
  node converter.mjs
  ```

## Issue
have to use createPuppeteerStealth plugin to crawl the Cloudflare,
but a process will crash when call page.close()
