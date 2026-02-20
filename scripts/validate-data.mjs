import fs from "node:fs";

const FILE = "data/data.json";

function fail(message) {
    console.error(`data validation failed: ${message}`);
    process.exitCode = 1;
}

if (!fs.existsSync(FILE)) {
    fail(`missing file ${FILE}`);
    process.exit();
}

let parsed;
try {
    parsed = JSON.parse(fs.readFileSync(FILE, "utf8"));
} catch (error) {
    fail(`invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    process.exit();
}

if (!Array.isArray(parsed)) {
    fail("top-level value must be an array");
    process.exit();
}

if (parsed.length === 0) {
    fail("array is empty");
}

const ids = new Set();
const exactRows = new Set();
const categoryIdsByName = new Map();
const categoryNamesById = new Map();

for (const [index, entry] of parsed.entries()) {
    const path = `entry[${index}]`;

    if (typeof entry !== "object" || entry === null) {
        fail(`${path} must be an object`);
        continue;
    }

    const { id, category_id: categoryId, category, title, content } = entry;

    if (!Number.isInteger(id)) {
        fail(`${path}.id must be an integer`);
    } else if (ids.has(id)) {
        fail(`${path}.id duplicates value ${id}`);
    } else {
        ids.add(id);
    }

    if (!Number.isInteger(categoryId)) {
        fail(`${path}.category_id must be an integer`);
    }

    if (typeof category !== "string" || category.trim() === "") {
        fail(`${path}.category must be a non-empty string`);
    }

    if (typeof title !== "string" || title.trim() === "") {
        fail(`${path}.title must be a non-empty string`);
    }

    if (typeof content !== "string" || content.trim() === "") {
        fail(`${path}.content must be a non-empty string`);
    }

    if (typeof category === "string" && Number.isInteger(categoryId)) {
        const knownId = categoryIdsByName.get(category);
        if (knownId !== undefined && knownId !== categoryId) {
            fail(
                `${path} maps category '${category}' to conflicting category_id (${knownId} vs ${categoryId})`
            );
        }
        categoryIdsByName.set(category, categoryId);

        const knownCategory = categoryNamesById.get(categoryId);
        if (knownCategory !== undefined && knownCategory !== category) {
            fail(
                `${path} maps category_id '${categoryId}' to conflicting category (${knownCategory} vs ${category})`
            );
        }
        categoryNamesById.set(categoryId, category);
    }

    if (
        typeof category === "string" &&
        typeof title === "string" &&
        typeof content === "string"
    ) {
        const exactKey = `${category}|||${title}|||${content}`;
        if (exactRows.has(exactKey)) {
            fail(`${path} is an exact duplicate of a previous row`);
        } else {
            exactRows.add(exactKey);
        }
    }
}

if (process.exitCode === 1) {
    process.exit();
}

console.log(
    `data validation passed: ${parsed.length} rows, ${categoryIdsByName.size} categories`
);
