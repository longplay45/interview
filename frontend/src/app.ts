//app.ts

import { fetchJSON } from "./data";
import { copyObject } from "./utilities";
import { renderCategories, renderContainer } from "./render";
import { initEventListeners } from "./events";

// data source
let url:string = '/data.json'


function init(){
    /**
     Load Data
     Render Categories
     Initialize Events
     */
    fetchJSON<any[]>(url)
        .then((data) => {
            globalThis.THRESHOLD = 0.3
            globalThis.DISTANCE = 100

            if (!Array.isArray(data)) {
                globalThis.CATS = []
                globalThis.CATS_SELECTED = []
                globalThis.DATA = []
                renderCategories()
                initEventListeners()
                renderContainer('Could not load /data.json.')
                return
            }

            /** Global Variables */
            globalThis.CATS = Array.from(new Set(data.map(item => item.category)))
            globalThis.CATS_SELECTED = copyObject(globalThis.CATS)
            globalThis.DATA = copyObject(data)
            renderCategories()
            initEventListeners()
        })
        .catch(error => {
            console.error(error)
        });
}

init()





