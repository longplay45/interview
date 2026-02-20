import { searchEntries } from "./core/search-core.ts";
import type { AppState, DataEntry } from "./types.ts";

type WorkerRequest =
    | { type: "init"; data: DataEntry[] }
    | {
          type: "search";
          requestId: number;
          searchValue: string;
          selectedCategories: string[];
          threshold: number;
          distance: number;
      };

type WorkerResponse =
    | { type: "ready" }
    | { type: "searchResult"; requestId: number; results: DataEntry[] };

let searchWorker: Worker | null = null;
let nextRequestId = 0;
const pendingSearches = new Map<number, (results: DataEntry[]) => void>();

export function initSearchWorker(data: DataEntry[]): void {
    if (typeof Worker === "undefined") {
        return;
    }

    if (searchWorker) {
        searchWorker.terminate();
    }

    searchWorker = new Worker(new URL("./search-worker.ts", import.meta.url), {
        type: "module"
    });

    searchWorker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const message = event.data;
        if (message.type !== "searchResult") {
            return;
        }

        const resolver = pendingSearches.get(message.requestId);
        if (!resolver) {
            return;
        }

        pendingSearches.delete(message.requestId);
        resolver(message.results);
    };

    searchWorker.postMessage({
        type: "init",
        data
    } satisfies WorkerRequest);
}

export function searchInWorker(
    searchValue: string,
    state: AppState
): Promise<DataEntry[]> {
    if (state.selectedCategories.length === 0) {
        return Promise.resolve([]);
    }

    if (!searchWorker) {
        return Promise.resolve(
            searchEntries(searchValue, {
                data: state.data,
                categories: state.categories,
                selectedCategories: state.selectedCategories,
                threshold: state.threshold,
                distance: state.distance
            })
        );
    }

    const requestId = ++nextRequestId;
    return new Promise<DataEntry[]>((resolve) => {
        pendingSearches.set(requestId, resolve);
        searchWorker?.postMessage({
            type: "search",
            requestId,
            searchValue,
            selectedCategories: state.selectedCategories,
            threshold: state.threshold,
            distance: state.distance
        } satisfies WorkerRequest);
    });
}
