import { searchEntries } from "./core/search-core.ts";
import * as elements from "./elements";
import { getState } from "./state.ts";
import type { DataEntry } from "./types.ts";

export function getSearchFieldValue(): string {
    return elements.searchField.value;
}

export function searchMe(searchValue: string): DataEntry[] {
    const state = getState();
    return searchEntries(searchValue, {
        data: state.data,
        categories: state.categories,
        selectedCategories: state.selectedCategories,
        threshold: state.threshold,
        distance: state.distance
    });
}
