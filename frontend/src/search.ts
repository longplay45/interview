import { searchEntries } from "./core/search-core.ts";
import * as elements from "./elements";
import { getState } from "./state.ts";
import type { DataEntry } from "./types.ts";

interface FilterCache {
    dataRef: DataEntry[];
    selectedKey: string;
    filteredData: DataEntry[];
}

let filterCache: FilterCache | null = null;

export function getSearchFieldValue(): string {
    return elements.searchField.value;
}

export function searchMe(searchValue: string): DataEntry[] {
    const state = getState();
    const filteredData = getFilteredData(state.data, state.selectedCategories);

    return searchEntries(searchValue, {
        data: filteredData,
        categories: ["__all__"],
        selectedCategories: ["__all__"],
        threshold: state.threshold,
        distance: state.distance
    });
}

function getFilteredData(
    data: DataEntry[],
    selectedCategories: string[]
): DataEntry[] {
    if (selectedCategories.length === 0) {
        return [];
    }

    const selectedKey = [...selectedCategories].sort().join("|||");
    if (
        filterCache &&
        filterCache.dataRef === data &&
        filterCache.selectedKey === selectedKey
    ) {
        return filterCache.filteredData;
    }

    const filteredData = data.filter((item) =>
        selectedCategories.includes(item.category)
    );

    filterCache = {
        dataRef: data,
        selectedKey,
        filteredData
    };

    return filteredData;
}
