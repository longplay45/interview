import { fetchJSON } from "./data";
import { initEventListeners } from "./events";
import { renderCategories, renderContainer } from "./render";
import { buildInitState } from "./core/init-core.ts";
import { resetSearchSettings, resetStateData, setStateData } from "./state.ts";
import type { DataEntry } from "./types.ts";

const DATA_URL = "/data.json";
let listenersInitialized = false;

export async function init(): Promise<void> {
    resetSearchSettings();

    const fetchedData = await fetchJSON<DataEntry[]>(DATA_URL);
    const initialState = buildInitState(fetchedData);

    if (initialState.fallback) {
        resetStateData();
    } else {
        setStateData(initialState.data);
    }

    renderCategories();

    if (!listenersInitialized) {
        initEventListeners();
        listenersInitialized = true;
    }

    if (initialState.fallback) {
        renderContainer("Could not load /data.json.");
    }
}

void init();
