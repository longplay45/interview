import type { AppState, DataEntry } from "./types.ts";

const DEFAULT_THRESHOLD = 0.3;
const DEFAULT_DISTANCE = 100;

const state: AppState = {
    data: [],
    categories: [],
    selectedCategories: [],
    threshold: DEFAULT_THRESHOLD,
    distance: DEFAULT_DISTANCE
};

export function getState(): AppState {
    return state;
}

export function resetStateData(): void {
    state.data = [];
    state.categories = [];
    state.selectedCategories = [];
}

export function setStateData(data: DataEntry[]): void {
    const categories = Array.from(new Set(data.map((item) => item.category)));
    state.data = data;
    state.categories = categories;
    state.selectedCategories = [...categories];
}

export function resetSearchSettings(): void {
    state.threshold = DEFAULT_THRESHOLD;
    state.distance = DEFAULT_DISTANCE;
}

export function toggleCategorySelection(category: string): void {
    const index = state.selectedCategories.indexOf(category);
    if (index > -1) {
        state.selectedCategories.splice(index, 1);
        return;
    }
    state.selectedCategories.push(category);
}

export function toggleAllCategories(): void {
    if (state.selectedCategories.length === 0) {
        state.selectedCategories = [...state.categories];
        return;
    }
    state.selectedCategories = [];
}
