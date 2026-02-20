export interface DataEntry {
    id: number;
    category_id: number;
    category: string;
    title: string;
    content: string;
}

export type PackedDataRow = [number, number, string, string, string];

export interface PackedDataset {
    v: number;
    k: ["id", "category_id", "category", "title", "content"];
    rows: PackedDataRow[];
}

export interface AppState {
    data: DataEntry[];
    categories: string[];
    selectedCategories: string[];
    threshold: number;
    distance: number;
}
