// keymap 

import * as elements from "./elements";
import * as render from "./render"
import { copyObject } from "./utilities";

export function matchString(searchValue: string): void {

    /// :C0-N CATEGORIES
    const matchesCategories = searchValue.match(/:c(\d+)/i);

    if (matchesCategories) {
        const categoryId = Number(matchesCategories[1]);
        const categoryIndex = categoryId - 1;

        if (categoryIndex >= 0 && categoryIndex < globalThis.CATS.length) {
            render.toggleCat(globalThis.CATS[categoryIndex])
        } else if (categoryId === 0) {
            // TOGGLE ALL CATEGORIES ON / OFF
            if (globalThis.CATS_SELECTED.length === 0) {
                globalThis.CATS_SELECTED = copyObject(globalThis.CATS)
            } else {
                globalThis.CATS_SELECTED = []
            }
            render.renderCategories()
        } else {
            elements.searchField.value = ''
            return
        }
        elements.searchField.value = ''
    }

    // :D0-1000 Fuzzy Search Distance
    const matchesDistance = searchValue.match(/:d(\d{1,4})/i);
    if (matchesDistance) {
        const distance = Number(matchesDistance[1])
        if (!Number.isNaN(distance)) {
            globalThis.DISTANCE = Math.max(0, Math.min(1000, distance))
            elements.searchField.value = ''
            render.renderContainer(`Fuzzy search distance: ${globalThis.DISTANCE}.`)
        }
    }


    // :F0-9 Fuzzy Search Threshold
    const matchesThreshold = searchValue.match(/:t([0-9])/i);
    if (matchesThreshold) {
        const threshold = Number(matchesThreshold[1])
        if (!Number.isNaN(threshold)) {
            globalThis.THRESHOLD = threshold / 10
            elements.thresholdSlider.value = `${threshold}`
            elements.searchField.value = ''
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
