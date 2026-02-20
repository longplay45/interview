/// <reference lib="webworker" />

import { searchEntries } from "./core/search-core.ts";
import type { DataEntry } from "./types.ts";

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

let dataEntries: DataEntry[] = [];

const workerContext = self as DedicatedWorkerGlobalScope;

workerContext.onmessage = (event: MessageEvent<WorkerRequest>) => {
    const message = event.data;

    if (message.type === "init") {
        dataEntries = message.data;
        workerContext.postMessage({ type: "ready" } satisfies WorkerResponse);
        return;
    }

    if (message.type === "search") {
        if (message.selectedCategories.length === 0) {
            workerContext.postMessage({
                type: "searchResult",
                requestId: message.requestId,
                results: []
            } satisfies WorkerResponse);
            return;
        }

        const results = searchEntries(message.searchValue, {
            data: dataEntries,
            categories: ["__all__"],
            selectedCategories: message.selectedCategories,
            threshold: message.threshold,
            distance: message.distance
        });

        workerContext.postMessage({
            type: "searchResult",
            requestId: message.requestId,
            results
        } satisfies WorkerResponse);
    }
};

export {};
