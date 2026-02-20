import assert from "node:assert/strict";
import test from "node:test";

import { searchEntries } from "../frontend/src/core/search-core.ts";
import type { DataEntry } from "../frontend/src/types.ts";

const DATA: DataEntry[] = [
    {
        id: 1,
        category_id: 1,
        category: "DA",
        title: "database",
        content: "Database basics"
    },
    {
        id: 2,
        category_id: 4,
        category: "SQL",
        title: "inner join",
        content: "Inner join basics"
    },
    {
        id: 3,
        category_id: 4,
        category: "SQL",
        title: "window function",
        content: "Window function basics"
    }
];

test("searchEntries filters by selected categories for browse mode", () => {
    const results = searchEntries("*", {
        data: DATA,
        categories: ["DA", "SQL"],
        selectedCategories: ["SQL"],
        threshold: 0.3,
        distance: 100
    });

    assert.equal(results.length, 2);
    assert.deepEqual(
        results.map((entry) => entry.title),
        ["inner join", "window function"]
    );
});

test("searchEntries performs fuzzy title search", () => {
    const results = searchEntries("databse", {
        data: DATA,
        categories: ["DA", "SQL"],
        selectedCategories: ["DA", "SQL"],
        threshold: 0.4,
        distance: 100
    });

    assert.equal(results.length, 1);
    assert.equal(results[0]?.title, "database");
});
