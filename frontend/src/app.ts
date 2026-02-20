import { fetchDataEntries } from "./data";
import { initEventListeners } from "./events";
import { renderCategories, renderContainer } from "./render";
import { buildInitState } from "./core/init-core.ts";
import { resetSearchSettings, resetStateData, setStateData } from "./state.ts";
import { syncSearchWorkerData } from "./search";

const DATA_URL = "/data.packed.json";
let listenersInitialized = false;

export async function init(): Promise<void> {
    resetSearchSettings();

    const fetchedData = await fetchDataEntries(DATA_URL);
    const initialState = buildInitState(fetchedData);

    if (initialState.fallback) {
        resetStateData();
    } else {
        setStateData(initialState.data);
    }
    syncSearchWorkerData(initialState.data);

    renderCategories();

    if (!listenersInitialized) {
        initEventListeners();
        listenersInitialized = true;
    }

    if (initialState.fallback) {
        renderContainer("Could not load /data.packed.json.");
    }
}

void init();
