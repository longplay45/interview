import fs from "node:fs";

const FILE = "data/data.json";
const PACKED_FILE = "data/data.packed.json";
const PACKED_KEYS = ["id", "category_id", "category", "title", "content"];

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

if (!fs.existsSync(PACKED_FILE)) {
    fail(`missing packed file ${PACKED_FILE}`);
    process.exit();
}

let packed;
try {
    packed = JSON.parse(fs.readFileSync(PACKED_FILE, "utf8"));
} catch (error) {
    fail(`invalid packed JSON: ${error instanceof Error ? error.message : String(error)}`);
    process.exit();
}

if (!packed || typeof packed !== "object") {
    fail("packed dataset must be an object");
    process.exit();
}

if (packed.v !== 1) {
    fail("packed dataset version must be 1");
}

if (!Array.isArray(packed.k) || packed.k.join("|") !== PACKED_KEYS.join("|")) {
    fail("packed dataset keys are invalid");
}

if (!Array.isArray(packed.rows)) {
    fail("packed dataset rows must be an array");
    process.exit();
}

if (packed.rows.length !== parsed.length) {
    fail("packed dataset row count does not match data.json");
}

for (let index = 0; index < packed.rows.length; index += 1) {
    const packedRow = packed.rows[index];
    const sourceRow = parsed[index];
    if (!Array.isArray(packedRow) || packedRow.length !== 5) {
        fail(`packed row ${index} must be a 5-item array`);
        continue;
    }

    const [id, categoryId, category, title, content] = packedRow;
    if (
        id !== sourceRow.id ||
        categoryId !== sourceRow.category_id ||
        category !== sourceRow.category ||
        title !== sourceRow.title ||
        content !== sourceRow.content
    ) {
        fail(`packed row ${index} does not match source data`);
    }
}

if (process.exitCode === 1) {
    process.exit();
}

console.log(`packed validation passed: ${packed.rows.length} rows`);
