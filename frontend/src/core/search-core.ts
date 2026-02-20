import Fuse from "fuse.js";
import type { DataEntry } from "../types.ts";

export interface SearchConfig {
    data: DataEntry[];
    categories: string[];
    selectedCategories: string[];
    threshold: number;
    distance: number;
}

export function filterBySelectedCategories(
    data: DataEntry[],
    selectedCategories: string[]
): DataEntry[] {
    if (selectedCategories.length === 0) {
        return data;
    }

    return data.filter((item) => selectedCategories.includes(item.category));
}

export function fuzzySearchTitles(
    data: DataEntry[],
    searchString: string,
    threshold: number,
    distance: number
): DataEntry[] {
    const options: Fuse.IFuseOptions<DataEntry> = {
        keys: ["title"],
        threshold,
        distance
    };

    const fuse = new Fuse(data, options);
    const results = fuse.search(searchString);
    return results.map(({ item }) => item);
}

export function searchEntries(
    searchValue: string,
    config: SearchConfig
): DataEntry[] {
    const baseData = [...config.data];
    const categoryFiltered =
        config.categories.length !== config.selectedCategories.length
            ? filterBySelectedCategories(baseData, config.selectedCategories)
            : baseData;

    if (searchValue === "*") {
        return categoryFiltered;
    }

    return fuzzySearchTitles(
        categoryFiltered,
        searchValue,
        config.threshold,
        config.distance
    );
}
