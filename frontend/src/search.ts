//search.ts

import { copyObject } from "./utilities";
import Fuse from 'fuse.js';

export function getSearchFieldValue(): string {
    const searchField = document.getElementById('search_field') as HTMLInputElement;
    return searchField.value;
}

export function searchMe(searchValue: string): any[] {
    let filteredData = copyObject(globalThis.DATA);
    if (globalThis.CATS.length !== globalThis.CATS_SELECTED.length) {
        filteredData = filterData(filteredData);
    }
    
    if (searchValue != '*') {
        filteredData = fuzzySearch(filteredData, searchValue);
    }
    return filteredData;
}

function filterData(data: any[]): any[] {
    if (globalThis.CATS_SELECTED.length > 0) {
        return data.filter(item => globalThis.CATS_SELECTED.includes(item.category));
    }
    return data;
}

function fuzzySearch(data: any[], searchString: string): any[] {
    const options: Fuse.IFuseOptions<any> = {
        keys: ['title'],
        threshold: globalThis.THRESHOLD, // Adjust the threshold value as desired
        distance: globalThis.DISTANCE,
    };

    const fuse = new Fuse(data, options);
    const results = fuse.search(searchString);

    return results.map(({ item }) => item);
}
