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

    const fuzzyResults = fuzzySearchTitles(
        categoryFiltered,
        searchValue,
        config.threshold,
        config.distance
    );

    if (fuzzyResults.length > 0) {
        return fuzzyResults;
    }

    return fallbackTokenSearch(categoryFiltered, searchValue);
}

function fallbackTokenSearch(data: DataEntry[], searchValue: string): DataEntry[] {
    const normalizedQuery = normalizeForTokenMatch(searchValue);
    const compactQuery = compactForTokenMatch(searchValue);
    if (!normalizedQuery) {
        return [];
    }

    const tokens = normalizedQuery.split(" ").filter(Boolean);
    const hasInformativeToken = tokens.some((token) => token.length > 1);

    if (!hasInformativeToken && compactQuery.length < 3) {
        return [];
    }

    return data.filter((item) => {
        const normalizedTitle = normalizeForTokenMatch(item.title);
        const compactTitle = compactForTokenMatch(item.title);
        const hasAllTokens = tokens.every((token) => normalizedTitle.includes(token));
        const hasCompactMatch =
            compactQuery.length >= 3 && compactTitle.includes(compactQuery);
        return hasAllTokens || hasCompactMatch;
    });
}

function normalizeForTokenMatch(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .replace(/\s+/g, " ");
}

function compactForTokenMatch(value: string): string {
    return normalizeForTokenMatch(value).replace(/\s+/g, "");
}
