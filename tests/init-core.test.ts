import assert from "node:assert/strict";
import test from "node:test";

import { buildInitState } from "../frontend/src/core/init-core.ts";
import type { DataEntry } from "../frontend/src/types.ts";

test("buildInitState returns fallback state for missing data", () => {
    const result = buildInitState(null);

    assert.equal(result.fallback, true);
    assert.deepEqual(result.data, []);
    assert.deepEqual(result.categories, []);
    assert.deepEqual(result.selectedCategories, []);
});

test("buildInitState builds categories and selection from loaded data", () => {
    const data: DataEntry[] = [
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
            title: "join",
            content: "Join basics"
        },
        {
            id: 3,
            category_id: 4,
            category: "SQL",
            title: "where",
            content: "Where basics"
        }
    ];

    const result = buildInitState(data);

    assert.equal(result.fallback, false);
    assert.equal(result.data.length, 3);
    assert.deepEqual(result.categories, ["DA", "SQL"]);
    assert.deepEqual(result.selectedCategories, ["DA", "SQL"]);
});
