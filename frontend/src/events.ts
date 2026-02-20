import * as elements from "./elements";
import * as keymap from "./keymap";
import * as render from "./render";
import { getSearchFieldValue, searchMe, searchMeAsync } from "./search";
import { getState } from "./state.ts";

const SEARCH_DEBOUNCE_MS = 100;
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let searchRequestToken = 0;

export function initEventListeners(): void {
    addKeyUpListeners();
    addKeyDownListeners();
    addThresholdSliderListener();
}

export function addHelpListeners(): void {
    const helpElement = document.getElementById("help");
    helpElement?.addEventListener("click", render.help);
}

export function addCategoryListeners(): void {
    const categoryElements = document.querySelectorAll<HTMLLIElement>(
        "#categories .category"
    );
    categoryElements.forEach((element) => {
        element.addEventListener("click", render.toggleCategory);
    });
}

function addKeyDownListeners(): void {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        const isModifierKey = event.metaKey || event.altKey || event.ctrlKey;
        const isCopyCommand =
            (event.metaKey && key === "c") ||
            (event.altKey && key === "c") ||
            (event.ctrlKey && key === "c");

        if (!isModifierKey || isCopyCommand) {
            if (isCopyCommand) {
                return;
            }

            elements.searchField.focus();

            if (key === "enter") {
                event.preventDefault();
                elements.searchField.value = "";
            }
        }
    });
}

function addThresholdSliderListener(): void {
    elements.thresholdSlider.addEventListener("change", () => {
        const state = getState();
        const sliderValue = Number(elements.thresholdSlider.value);
        state.threshold = sliderValue / 10;
        render.renderSearchResults(searchMe(getSearchFieldValue()));
    });
}

function addKeyUpListeners(): void {
    elements.searchField.addEventListener("keyup", (event: KeyboardEvent) => {
        const searchValue = getSearchFieldValue();

        if (event.key === "Escape") {
            clearSearchDebounce();
            elements.searchField.value = "";
            render.renderContainer("");
            render.renderSearchResults(searchMe(getSearchFieldValue()));
        } else if (searchValue.startsWith(":")) {
            clearSearchDebounce();
            keymap.matchString(searchValue);
        } else {
            scheduleSearch(searchValue);
        }
    });
}

function scheduleSearch(searchValue: string): void {
    const requestToken = ++searchRequestToken;
    clearSearchDebounce();
    searchDebounceTimer = setTimeout(() => {
        void searchMeAsync(searchValue).then((results) => {
            if (requestToken !== searchRequestToken) {
                return;
            }
            render.renderSearchResults(results);
        });
        searchDebounceTimer = null;
    }, SEARCH_DEBOUNCE_MS);
}

function clearSearchDebounce(): void {
    searchRequestToken += 1;
    if (searchDebounceTimer !== null) {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = null;
    }
}
