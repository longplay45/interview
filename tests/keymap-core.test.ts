import assert from "node:assert/strict";
import test from "node:test";

import { parseKeyCommand } from "../frontend/src/core/keymap-core.ts";

test("parseKeyCommand handles category commands", () => {
    assert.deepEqual(parseKeyCommand(":c0", 5), {
        type: "toggleAllCategories"
    });

    assert.deepEqual(parseKeyCommand(":c3", 5), {
        type: "toggleCategory",
        categoryIndex: 2
    });

    assert.deepEqual(parseKeyCommand(":c9", 5), { type: "none" });
});

test("parseKeyCommand handles threshold and distance commands", () => {
    assert.deepEqual(parseKeyCommand(":t7", 5), {
        type: "setThreshold",
        thresholdTenths: 7
    });

    assert.deepEqual(parseKeyCommand(":d1500", 5), {
        type: "setDistance",
        distance: 1000
    });

    assert.deepEqual(parseKeyCommand(":d42", 5), {
        type: "setDistance",
        distance: 42
    });
});

test("parseKeyCommand handles help and unknown commands", () => {
    assert.deepEqual(parseKeyCommand(":h", 5), { type: "showHelp" });
    assert.deepEqual(parseKeyCommand(":unknown", 5), { type: "none" });
});
