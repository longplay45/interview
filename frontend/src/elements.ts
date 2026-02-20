function getRequiredElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Missing required element: #${id}`);
    }
    return element as T;
}

export const thresholdSlider = getRequiredElement<HTMLInputElement>("thresholdRange");
export const categoriesContainer = getRequiredElement<HTMLDivElement>("categories");
export const searchField = getRequiredElement<HTMLInputElement>("search_field");
export const container = getRequiredElement<HTMLDivElement>("container");
