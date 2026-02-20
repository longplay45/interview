import type { DataEntry } from "../types.ts";

export interface InitState {
    data: DataEntry[];
    categories: string[];
    selectedCategories: string[];
    fallback: boolean;
}

export function buildInitState(data: DataEntry[] | null): InitState {
    if (!Array.isArray(data)) {
        return {
            data: [],
            categories: [],
            selectedCategories: [],
            fallback: true
        };
    }

    const categories = Array.from(new Set(data.map((item) => item.category)));
    return {
        data,
        categories,
        selectedCategories: [...categories],
        fallback: false
    };
}
