import fs from "node:fs";

const SOURCE_FILE = "data/data.json";
const OUTPUT_FILE = "data/data.packed.json";

const PACKED_KEYS = ["id", "category_id", "category", "title", "content"];

function fail(message) {
    console.error(`prepare:data failed: ${message}`);
    process.exit(1);
}

if (!fs.existsSync(SOURCE_FILE)) {
    fail(`missing source file ${SOURCE_FILE}`);
}

let parsed;
try {
    parsed = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf8"));
} catch (error) {
    fail(`invalid JSON in ${SOURCE_FILE}: ${error instanceof Error ? error.message : String(error)}`);
}

if (!Array.isArray(parsed)) {
    fail("source file must be a JSON array");
}

const rows = parsed.map((entry, index) => {
    if (!entry || typeof entry !== "object") {
        fail(`entry[${index}] must be an object`);
    }

    const { id, category_id: categoryId, category, title, content } = entry;
    return [id, categoryId, category, title, content];
});

const packed = {
    v: 1,
    k: PACKED_KEYS,
    rows
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(packed));

const sourceSize = fs.statSync(SOURCE_FILE).size;
const packedSize = fs.statSync(OUTPUT_FILE).size;
const ratio = sourceSize > 0 ? ((packedSize / sourceSize) * 100).toFixed(1) : "0.0";

console.log(
    `prepared packed dataset: ${rows.length} rows, ${SOURCE_FILE} -> ${OUTPUT_FILE} (${packedSize} bytes, ${ratio}% of source)`
);
