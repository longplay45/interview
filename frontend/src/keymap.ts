import * as elements from "./elements";
import * as render from "./render";
import { searchMe } from "./search";
import {
    getState,
    toggleAllCategories,
    toggleCategorySelection
} from "./state.ts";
import { parseKeyCommand } from "./core/keymap-core.ts";

function clearSearchField(): void {
    elements.searchField.value = "";
}

export function matchString(searchValue: string): void {
    const state = getState();
    const action = parseKeyCommand(searchValue, state.categories.length);

    switch (action.type) {
        case "toggleCategory": {
            const category = state.categories[action.categoryIndex];
            if (!category) {
                clearSearchField();
                return;
            }
            toggleCategorySelection(category);
            clearSearchField();
            render.renderCategories();
            render.renderSearchResults(searchMe("*"));
            return;
        }
        case "toggleAllCategories": {
            toggleAllCategories();
            clearSearchField();
            render.renderCategories();
            render.renderSearchResults(searchMe("*"));
            return;
        }
        case "setDistance": {
            state.distance = action.distance;
            clearSearchField();
            render.renderContainer(`Fuzzy search distance: ${state.distance}.`);
            return;
        }
        case "setThreshold": {
            state.threshold = action.thresholdTenths / 10;
            elements.thresholdSlider.value = `${action.thresholdTenths}`;
            clearSearchField();
            render.threshold();
            return;
        }
        case "showHelp": {
            clearSearchField();
            render.help();
            return;
        }
        case "none":
            return;
        default:
            return;
    }
}
