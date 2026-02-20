import type { DataEntry, PackedDataset, PackedDataRow } from "./types.ts";

const PACKED_KEYS = ["id", "category_id", "category", "title", "content"] as const;

export async function fetchJSON<T>(url: string): Promise<T | null> {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            },
            mode: "cors"
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = (await response.json()) as T;
        return data;
    } catch (error: unknown) {
        console.error(error);
        return null;
    }
}

export async function fetchDataEntries(url: string): Promise<DataEntry[] | null> {
    const rawData = await fetchJSON<unknown>(url);
    if (rawData === null) {
        return null;
    }

    if (Array.isArray(rawData)) {
        return rawData as DataEntry[];
    }

    if (isPackedDataset(rawData)) {
        return unpackPackedDataset(rawData);
    }

    return null;
}

function isPackedDataset(value: unknown): value is PackedDataset {
    if (!value || typeof value !== "object") {
        return false;
    }

    const candidate = value as Partial<PackedDataset>;
    if (candidate.v !== 1) {
        return false;
    }

    if (
        !Array.isArray(candidate.k) ||
        candidate.k.length !== PACKED_KEYS.length ||
        candidate.k.join("|") !== PACKED_KEYS.join("|")
    ) {
        return false;
    }

    return Array.isArray(candidate.rows);
}

function unpackPackedDataset(dataset: PackedDataset): DataEntry[] {
    return dataset.rows.map((row: PackedDataRow) => ({
        id: row[0],
        category_id: row[1],
        category: row[2],
        title: row[3],
        content: row[4]
    }));
}
