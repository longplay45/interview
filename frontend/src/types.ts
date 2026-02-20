export interface DataEntry {
    id: number;
    category_id: number;
    category: string;
    title: string;
    content: string;
}

export interface AppState {
    data: DataEntry[];
    categories: string[];
    selectedCategories: string[];
    threshold: number;
    distance: number;
}
