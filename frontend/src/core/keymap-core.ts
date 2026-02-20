export type KeyCommandAction =
    | { type: "toggleCategory"; categoryIndex: number }
    | { type: "toggleAllCategories" }
    | { type: "setDistance"; distance: number }
    | { type: "setThreshold"; thresholdTenths: number }
    | { type: "showHelp" }
    | { type: "none" };

export function parseKeyCommand(
    searchValue: string,
    categoryCount: number
): KeyCommandAction {
    const categoriesMatch = searchValue.match(/^:c(\d+)$/i);
    if (categoriesMatch) {
        const categoryId = Number(categoriesMatch[1]);
        if (Number.isNaN(categoryId)) {
            return { type: "none" };
        }

        if (categoryId === 0) {
            return { type: "toggleAllCategories" };
        }

        const categoryIndex = categoryId - 1;
        if (categoryIndex >= 0 && categoryIndex < categoryCount) {
            return { type: "toggleCategory", categoryIndex };
        }

        return { type: "none" };
    }

    const distanceMatch = searchValue.match(/^:d(\d{1,4})$/i);
    if (distanceMatch) {
        const distance = Math.max(
            0,
            Math.min(1000, Number(distanceMatch[1]))
        );
        if (Number.isNaN(distance)) {
            return { type: "none" };
        }
        return { type: "setDistance", distance };
    }

    const thresholdMatch = searchValue.match(/^:t([0-9])$/i);
    if (thresholdMatch) {
        const thresholdTenths = Number(thresholdMatch[1]);
        if (Number.isNaN(thresholdTenths)) {
            return { type: "none" };
        }
        return { type: "setThreshold", thresholdTenths };
    }

    if (/^:h$/i.test(searchValue)) {
        return { type: "showHelp" };
    }

    return { type: "none" };
}
