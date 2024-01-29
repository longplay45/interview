//app.ts

import { fetchJSON } from "./data";
import { copyObject } from "./utilities";
import { renderCategories } from "./render";
import { initEventListeners } from "./events";

// data source
let url:string = '/data.json'

function init(){
    /**
     Load Data
     Render Categories
     Initialize Events
     */
    fetchJSON(url)
    .then((data:any) => {
            /** Global Variables */
            globalThis.CATS = Array.from(new Set(data.map(item => item.category)))
            globalThis.CATS_SELECTED = copyObject(globalThis.CATS)
            globalThis.DATA = copyObject(data)
            globalThis.THRESHOLD = 0.6
            globalThis.DISTANCE = 100
            renderCategories()
            initEventListeners()
        })
        .catch(error => {
            console.log(error)
        });
}

init()






