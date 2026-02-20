import Fuse from "fuse.js";
import type { DataEntry } from "../types.ts";

const fuseCache = new WeakMap<DataEntry[], Map<string, Fuse<DataEntry>>>();

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
    const fuse = getFuseInstance(data, threshold, distance);
    const results = fuse.search(searchString);
    return results.map(({ item }) => item);
}

export function searchEntries(
    searchValue: string,
    config: SearchConfig
): DataEntry[] {
    const categoryFiltered =
        config.categories.length !== config.selectedCategories.length
            ? filterBySelectedCategories(config.data, config.selectedCategories)
            : config.data;

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

function getFuseInstance(
    data: DataEntry[],
    threshold: number,
    distance: number
): Fuse<DataEntry> {
    const cacheKey = `${threshold}|${distance}`;
    const cacheByOptions = fuseCache.get(data);
    if (cacheByOptions?.has(cacheKey)) {
        return cacheByOptions.get(cacheKey) as Fuse<DataEntry>;
    }

    const options: Fuse.IFuseOptions<DataEntry> = {
        keys: ["title"],
        threshold,
        distance
    };

    const fuse = new Fuse(data, options);
    if (cacheByOptions) {
        cacheByOptions.set(cacheKey, fuse);
    } else {
        fuseCache.set(data, new Map([[cacheKey, fuse]]));
    }

    return fuse;
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
