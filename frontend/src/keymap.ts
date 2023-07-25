// keymap 

import * as elements from "./elements";
import * as render from "./render"
import { copyObject } from "./utilities";

export function matchString(searchValue: String): void {

    /// :C0-9 CATEGORIES
    const regexCategories = /:c[0-9]/gi;
    const matchesCategories = searchValue.match(regexCategories);

    if (matchesCategories) {
        let categorieId: number = +matchesCategories[0][2]
        categorieId -= 1
        if (categorieId >= 0) {
            render.toggleCat(globalThis.CATS[categorieId])
        } else {
            //TOGGLE ALL CATEGORIES ON / OFF
            if (globalThis.CATS_SELECTED.length == 0) {
                globalThis.CATS_SELECTED = copyObject(globalThis.CATS)
            } else {
                globalThis.CATS_SELECTED = []
            }
            render.renderCategories()
        }
        //elements.container.innerHTML = categories
        elements.searchField.value = ''
    }

    // :D0-1000 Fuzzy Search Distance
    const regexDistance = /:t[0-1000]/gi;
    const matchesDistance = searchValue.match(regexDistance);
    if (matchesDistance) {
        if (matchesDistance.length > 0) {
            const distance: string = matchesDistance[0][2]
            if (distance) globalThis.DISTANCE = distance
            elements.searchField.value = ``
            render.threshold()
        }
    }


    // :F0-9 Fuzzy Search Threshold
    const regexThreshold = /:t[0-9]/gi;
    const matchesThreshold = searchValue.match(regexThreshold);
    if (matchesThreshold) {
        if (matchesThreshold.length > 0) {
            const threshold: string = matchesThreshold[0][2]
            if (threshold) globalThis.THRESHOLD = threshold
            elements.thresholdSlider.value = '' + globalThis.THRESHOLD
            elements.searchField.value = ``
            render.threshold()
        }
    }

    // :H HELP
    const regexHelp = /:h/gi;
    const matchesHelp = searchValue.match(regexHelp);
    if (matchesHelp) {
        elements.searchField.value = ''
        render.help()
    }
}

